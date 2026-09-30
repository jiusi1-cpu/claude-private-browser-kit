using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

public class NetworkProbe
{
    public static int Main(string[] args)
    {
        try
        {
            string mode = args[0];
            IPAddress ip = IPAddress.Parse(args[1]);
            int port = int.Parse(args[2]);
            using (var socket = new Socket(ip.AddressFamily,
                mode == "udp" ? SocketType.Dgram : SocketType.Stream,
                mode == "udp" ? ProtocolType.Udp : ProtocolType.Tcp))
            {
                socket.SendTimeout = 3000;
                socket.ReceiveTimeout = 3000;
                var task = socket.BeginConnect(new IPEndPoint(ip, port), null, null);
                if (!task.AsyncWaitHandle.WaitOne(3500))
                {
                    Console.WriteLine("TIMEOUT");
                    return 2;
                }
                socket.EndConnect(task);
                if (mode == "udp") socket.Send(Encoding.ASCII.GetBytes("claude-guard-test"));
                Console.WriteLine("ALLOWED");
                return 0;
            }
        }
        catch (SocketException ex)
        {
            Console.WriteLine("SOCKET_ERROR=" + ex.NativeErrorCode + "; " + ex.SocketErrorCode);
            return 1;
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR=" + ex.GetType().Name);
            return 3;
        }
    }
}
