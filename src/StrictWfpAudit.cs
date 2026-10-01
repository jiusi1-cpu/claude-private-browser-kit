using System;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

// Read-only WFP inspection. This class has no install/delete API.
public static class StrictWfpAudit {
    static readonly Guid Sub = new Guid("5f0d3c98-34ad-4c55-a78f-2c6ed6591928");
    static readonly Guid V4 = new Guid("c38d57d1-05a7-4c33-904f-7fbceee60e82");
    static readonly Guid V6 = new Guid("4a72393b-319f-44bc-84c3-ba54dcb3b6b4");
    static readonly Guid App = new Guid("d78e1e87-8644-4ea5-9437-d809ecefc971");
    static readonly Guid Address = new Guid("b235ae9a-1d64-49b8-a44c-5ff3d9095045");
    static readonly Guid Port = new Guid("c35a604d-d22b-4e1a-91b4-68f674ee674b");
    static readonly Guid Protocol = new Guid("3971ef2b-623e-4f9a-8cb1-6e79b806b9a7");
    [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
    struct Display { [MarshalAs(UnmanagedType.LPWStr)] public string name; [MarshalAs(UnmanagedType.LPWStr)] public string description; }
    [StructLayout(LayoutKind.Sequential)] struct Blob { public uint size; public IntPtr data; }
    [StructLayout(LayoutKind.Explicit, Size=16)] struct Value { [FieldOffset(0)] public uint type; [FieldOffset(8)] public IntPtr ptr; [FieldOffset(8)] public uint number; }
    [StructLayout(LayoutKind.Sequential)] struct Condition { public Guid key; public uint match; public Value value; }
    [StructLayout(LayoutKind.Sequential)] struct Action { public uint type; public Guid key; }
    [StructLayout(LayoutKind.Explicit, Size=16)] struct Context { [FieldOffset(0)] public ulong raw; [FieldOffset(0)] public Guid key; }
    [StructLayout(LayoutKind.Sequential)] struct Filter {
        public Guid key; public Display display; public uint flags; public IntPtr provider; public Blob data;
        public Guid layer; public Guid sublayer; public Value weight; public uint count; public IntPtr conditions;
        public Action action; public Context context; public IntPtr reserved; public ulong id; public Value effectiveWeight;
    }
    [DllImport("fwpuclnt.dll", CharSet=CharSet.Unicode)] static extern uint FwpmEngineOpen0(string server, uint auth, IntPtr identity, IntPtr session, out IntPtr engine);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmEngineClose0(IntPtr engine);
    [DllImport("fwpuclnt.dll", CharSet=CharSet.Unicode)] static extern uint FwpmGetAppIdFromFileName0(string file, out IntPtr appId);
    [DllImport("fwpuclnt.dll")] static extern uint FwpmFilterGetByKey0(IntPtr engine, ref Guid key, out IntPtr filter);
    [DllImport("fwpuclnt.dll")] static extern void FwpmFreeMemory0(ref IntPtr p);
    static Guid Key(string path, string tag) {
        using(var sha = SHA256.Create()) {
            var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(Sub+"|"+path.ToLowerInvariant()+"|"+tag));
            var bytes = new byte[16]; Array.Copy(hash, bytes, 16); return new Guid(bytes);
        }
    }
    static bool EqualBlob(IntPtr a, IntPtr b) {
        if(a == IntPtr.Zero || b == IntPtr.Zero) return false;
        var x = (Blob)Marshal.PtrToStructure(a, typeof(Blob));
        var y = (Blob)Marshal.PtrToStructure(b, typeof(Blob));
        if(x.size != y.size || x.size == 0 || x.size > 131072 || x.data == IntPtr.Zero || y.data == IntPtr.Zero) return false;
        for(int i=0; i<(int)x.size; i++) if(Marshal.ReadByte(x.data,i) != Marshal.ReadByte(y.data,i)) return false;
        return true;
    }
    static bool Matches(Filter f, Guid key, string tag, ushort port, IntPtr app) {
        bool numeric = tag == "address" || tag == "port" || tag == "protocol";
        if(f.key != key || (f.flags & 1) == 0 || (f.flags & 32) != 0 || f.layer != (tag == "all-v6" ? V6 : V4)
            || f.sublayer != Sub || f.action.type != 0x1001 || f.weight.type != 1 || f.weight.number != 15
            || f.count != (numeric ? 2u : 1u) || f.conditions == IntPtr.Zero) return false;
        bool foundApp=false, foundNumeric=false;
        int size=Marshal.SizeOf(typeof(Condition));
        for(int i=0; i<(int)f.count; i++) {
            var c=(Condition)Marshal.PtrToStructure(IntPtr.Add(f.conditions,i*size),typeof(Condition));
            if(c.key == App) {
                if(foundApp || c.match != 0 || c.value.type != 12 || !EqualBlob(c.value.ptr,app)) return false;
                foundApp=true;
            } else {
                Guid expected=tag == "address" ? Address : tag == "port" ? Port : Protocol;
                uint type=tag == "address" ? 3u : tag == "port" ? 2u : 1u;
                uint number=tag == "address" ? 0x7F000001u : tag == "port" ? port : 6u;
                if(!numeric || foundNumeric || c.key != expected || c.match != 10 || c.value.type != type || c.value.number != number) return false;
                foundNumeric=true;
            }
        }
        return foundApp && foundNumeric == numeric;
    }
    public static string Verify(string path, ushort port) {
        if(IntPtr.Size != 8) return "UNAVAILABLE:requires-x64";
        IntPtr engine=IntPtr.Zero, app=IntPtr.Zero;
        uint r=FwpmEngineOpen0(null,10,IntPtr.Zero,IntPtr.Zero,out engine);
        if(r != 0) return "UNAVAILABLE:engine-"+r.ToString("X8");
        try {
            r=FwpmGetAppIdFromFileName0(path,out app);
            if(r != 0) return "UNAVAILABLE:app-"+r.ToString("X8");
            foreach(string tag in (port == 0 ? new[]{"all-v4","all-v6"} : new[]{"address","port","protocol","all-v6"})) {
                Guid key=Key(path,tag); IntPtr p;
                r=FwpmFilterGetByKey0(engine,ref key,out p);
                if(r != 0) return "FAIL:"+tag+"-lookup-"+r.ToString("X8");
                try { if(!Matches((Filter)Marshal.PtrToStructure(p,typeof(Filter)),key,tag,port,app)) return "FAIL:"+tag+"-conditions"; }
                finally { FwpmFreeMemory0(ref p); }
            }
            return "PASS";
        } finally { if(app != IntPtr.Zero) FwpmFreeMemory0(ref app); FwpmEngineClose0(engine); }
    }
}
