using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

public static class ClaudeGuardWfp
{
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    static extern uint GetFinalPathNameByHandle(IntPtr file, StringBuilder path, uint size, uint flags);
    public static string FinalPath(string path) {
        using(var stream=System.IO.File.Open(path,System.IO.FileMode.Open,System.IO.FileAccess.Read,System.IO.FileShare.ReadWrite|System.IO.FileShare.Delete)) {
            var buffer=new StringBuilder(32768);
            uint size=GetFinalPathNameByHandle(stream.SafeFileHandle.DangerousGetHandle(),buffer,32768,0);
            if(size==0 || size>=32768) throw new System.ComponentModel.Win32Exception();
            return buffer.ToString();
        }
    }
    public static bool SameFile(string first,string second) {
        if(String.Equals(first,second,StringComparison.OrdinalIgnoreCase)) return true;
        try {return String.Equals(FinalPath(first),FinalPath(second),StringComparison.OrdinalIgnoreCase);} catch {return false;}
    }
    static readonly Guid SubKey = new Guid("5f0d3c98-34ad-4c55-a78f-2c6ed6591928");
    static readonly Guid V4 = new Guid("c38d57d1-05a7-4c33-904f-7fbceee60e82");
    static readonly Guid V6 = new Guid("4a72393b-319f-44bc-84c3-ba54dcb3b6b4");
    static readonly Guid App = new Guid("d78e1e87-8644-4ea5-9437-d809ecefc971");
    static readonly Guid Address = new Guid("b235ae9a-1d64-49b8-a44c-5ff3d9095045");
    static readonly Guid Port = new Guid("c35a604d-d22b-4e1a-91b4-68f674ee674b");
    static readonly Guid Protocol = new Guid("3971ef2b-623e-4f9a-8cb1-6e79b806b9a7");
    [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
    struct Display { [MarshalAs(UnmanagedType.LPWStr)] public string name; [MarshalAs(UnmanagedType.LPWStr)] public string description; }
    [StructLayout(LayoutKind.Sequential)] struct Blob { public uint size; public IntPtr data; }
    [StructLayout(LayoutKind.Explicit, Size=16)]
    struct Value { [FieldOffset(0)] public uint type; [FieldOffset(8)] public IntPtr ptr; [FieldOffset(8)] public uint number; }
    [StructLayout(LayoutKind.Sequential)] struct Condition { public Guid key; public uint match; public Value value; }
    [StructLayout(LayoutKind.Sequential)] struct Action { public uint type; public Guid key; }
    [StructLayout(LayoutKind.Explicit, Size=16)] struct Context { [FieldOffset(0)] public ulong raw; [FieldOffset(0)] public Guid key; }
    [StructLayout(LayoutKind.Sequential)]
    struct Filter {
        public Guid key; public Display display; public uint flags; public IntPtr provider; public Blob data;
        public Guid layer; public Guid sublayer; public Value weight; public uint count; public IntPtr conditions;
        public Action action; public Context context; public IntPtr reserved; public ulong id; public Value effectiveWeight;
    }
    [StructLayout(LayoutKind.Sequential)]
    struct Sublayer { public Guid key; public Display display; public uint flags; public IntPtr provider; public Blob data; public ushort weight; }
    [DllImport("fwpuclnt.dll", CharSet=CharSet.Unicode)] static extern uint FwpmEngineOpen0(string server, uint auth, IntPtr identity, IntPtr session, out IntPtr engine);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmEngineClose0(IntPtr engine);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmSubLayerAdd0(IntPtr engine, ref Sublayer layer, IntPtr sd);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmSubLayerDeleteByKey0(IntPtr engine, ref Guid key);
    [DllImport("fwpuclnt.dll", CharSet=CharSet.Unicode)] static extern uint FwpmGetAppIdFromFileName0(string file, out IntPtr appId);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmFilterAdd0(IntPtr engine, ref Filter filter, IntPtr sd, out ulong id);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmFilterGetByKey0(IntPtr engine, ref Guid key, out IntPtr filter);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmFilterDeleteByKey0(IntPtr engine, ref Guid key);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmTransactionBegin0(IntPtr engine, uint flags);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmTransactionCommit0(IntPtr engine);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmTransactionAbort0(IntPtr engine);
    [DllImport("fwpuclnt.dll")] static extern void FwpmFreeMemory0(ref IntPtr p);

    static void Check(uint value) { if(value != 0) throw new InvalidOperationException("WFP error 0x"+value.ToString("X8")); }
    static IntPtr Open() { IntPtr h; Check(FwpmEngineOpen0(null,10,IntPtr.Zero,IntPtr.Zero,out h)); return h; }
    static Guid Key(string path, string tag) {
        using(var sha = SHA256.Create()) {
            var hash=sha.ComputeHash(Encoding.UTF8.GetBytes(SubKey+"|"+path.ToLowerInvariant()+"|"+tag));
            var bytes=new byte[16]; Array.Copy(hash,bytes,16); return new Guid(bytes);
        }
    }
    static string[] Tags(ushort port) { return port==0 ? new[]{"all-v4","all-v6"} : new[]{"address","port","protocol","all-v6"}; }
    static Condition Numeric(Guid key, uint type, uint number) { return new Condition{key=key,match=10,value=new Value{type=type,number=number}}; }

    // Separate negative block filters leave precisely one IPv4 TCP endpoint open.
    // They also filter loopback connections, unlike a system-proxy setting.
    public static void Install(string path, ushort port) {
        if(IntPtr.Size!=8) throw new InvalidOperationException("Requires 64-bit process");
        IntPtr h=Open(),app=IntPtr.Zero;
        bool transaction=false;
        try {
            Check(FwpmTransactionBegin0(h,0)); transaction=true;
            var sub=new Sublayer{key=SubKey,flags=1,weight=65500,display=new Display{name="Claude Network Guard",description="App-scoped persistent fail-closed filters"}};
            uint r=FwpmSubLayerAdd0(h,ref sub,IntPtr.Zero); if(r!=0x80320009) Check(r);
            Check(FwpmGetAppIdFromFileName0(path,out app));
            var appCondition=new Condition{key=App,match=0,value=new Value{type=12,ptr=app}};
            foreach(string tag in Tags(port)) {
                var conditions=new List<Condition>{appCondition};
                if(tag=="address") conditions.Add(Numeric(Address,3,0x7F000001));
                if(tag=="port") conditions.Add(Numeric(Port,2,port));
                if(tag=="protocol") conditions.Add(Numeric(Protocol,1,6));
                Guid key=Key(path,tag); IntPtr old;
                r=FwpmFilterGetByKey0(h,ref key,out old);
                if(r==0) { FwpmFreeMemory0(ref old); Check(FwpmFilterDeleteByKey0(h,ref key)); }
                else if(r!=0x80320003) Check(r);
                int size=Marshal.SizeOf(typeof(Condition)); IntPtr memory=Marshal.AllocHGlobal(size*conditions.Count);
                try {
                    for(int i=0;i<conditions.Count;i++) Marshal.StructureToPtr(conditions[i],IntPtr.Add(memory,i*size),false);
                    var filter=new Filter{key=key,display=new Display{name="ClaudeGuard: "+System.IO.Path.GetFileName(path)+" "+tag,description=path},flags=1,
                        layer=tag=="all-v6"?V6:V4,sublayer=SubKey,weight=new Value{type=1,number=15},count=(uint)conditions.Count,conditions=memory,action=new Action{type=0x1001}};
                    ulong id; Check(FwpmFilterAdd0(h,ref filter,IntPtr.Zero,out id));
                } finally { Marshal.FreeHGlobal(memory); }
            }
            Check(FwpmTransactionCommit0(h)); transaction=false;
        } finally { if(transaction) FwpmTransactionAbort0(h); if(app!=IntPtr.Zero) FwpmFreeMemory0(ref app); FwpmEngineClose0(h); }
    }
    public static bool Verify(string path, ushort port) {
        IntPtr h=Open();
        try { foreach(var tag in Tags(port)) { Guid key=Key(path,tag); IntPtr f;
            uint r=FwpmFilterGetByKey0(h,ref key,out f); if(r!=0) return false;
            var filter=(Filter)Marshal.PtrToStructure(f,typeof(Filter));
            bool ok=(filter.flags&1)!=0 && (filter.flags&32)==0 && filter.sublayer==SubKey && filter.action.type==0x1001;
            FwpmFreeMemory0(ref f); if(!ok) return false;
        } return true; } finally { FwpmEngineClose0(h); }
    }
    public static void Remove(string path, ushort port) {
        IntPtr h=Open(); try { foreach(var tag in Tags(port)) { Guid key=Key(path,tag); uint r=FwpmFilterDeleteByKey0(h,ref key); if(r!=0x80320003) Check(r); } } finally {FwpmEngineClose0(h);}
    }
    public static void RemoveSublayer() { IntPtr h=Open(); try { Guid key=SubKey; Check(FwpmSubLayerDeleteByKey0(h,ref key)); } finally { FwpmEngineClose0(h); } }
}
