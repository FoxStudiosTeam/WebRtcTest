import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import ru.foxstudios.signaling_server.main
import ru.foxstudios.signaling_server.serverSocket
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.Socket
import java.net.SocketException
import kotlin.test.assertEquals

class SocketsTest {
    val thread = Thread{
        main()
    }

    @Test
    @DisplayName("SocketTest")
    fun socketTest() {
            try{
                thread.start()
                Thread.sleep(1000)
                val clientSocket = Socket("127.0.0.1", 8080)
                val inputStream = clientSocket.getInputStream()
                inputStream.use {
                    val reader = BufferedReader(InputStreamReader(it))
                    val value = reader.readLine()
                    assertEquals("/127.0.0.1:${clientSocket.localPort}",value)
                }
                clientSocket.close()
                serverSocket.close()
            }catch (e : SocketException){
                assertEquals("Socket is closed",e.message)
                thread.interrupt()
            }
    }
}