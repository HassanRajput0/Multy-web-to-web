(async () => {
  try {
    const { makeWASocket, useMultiFileAuthState, delay, DisconnectReason } = await import("@whiskeysockets/baileys");
    const fs = await import('fs');
    const pino = (await import('pino')).default;
    const readline = await import("readline");
    const exec = (await import("child_process")).exec;

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = (text) => new Promise((resolve) => rl.question(text, resolve));

    // ANSI color codes
    const reset = "\x1b[0m"; // Reset to default
    const green = "\x1b[1;32m"; // Green
    const yellow = "\x1b[1;33m"; // Yellow

    // Logo
    const logo = `${green}
 __    __ _           _                         
/ /\\ /\\ \\ |__   __ _| |_ ___  __ _ _ __  _ __  
\\ \\/  \\/ / '_ \\ / _\` | __/ __|/ _\` | '_ \\| '_ \\ 
 \\  /\\  /| | | | (_| | |\\__ \\ (_| | |_) | |_) |
  \\/  \\/ |_| |_|\\__,_|\\__|___/\\__,_| .__/| .__/ 
                                   |_|   |_|    
============================================
[~] Author  : HASSAN RAJPUT
[~] GitHub  : HassanRajput0
[~] Tool  : Automatic WhatsApp Message Sender
============================================`;

    // Function to clear the terminal screen and display the logo
    const clearScreen = () => {
      console.clear();
      console.log(logo);
    };

    // Variables to store input data
    let targetNumber = null;
    let messages = null;
    let intervalTime = null;
    let haterName = null;

    // Using multi-file auth state
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    // Function to send messages in sequence
    async function sendMessages(MznKing) {
      while (true) {
        for (const message of messages) {
          try {
            const currentTime = new Date().toLocaleTimeString();
            const fullMessage = `${haterName} ${message}`;
            await MznKing.sendMessage(targetNumber + '@c.us', { text: fullMessage });

            console.log(`${green}Target Number => ${reset}${targetNumber}`);
            console.log(`${green}Time => ${reset}${currentTime}`);
            console.log(`${green}Message => ${reset}${fullMessage}`);
            console.log('    [ =============== HASSAN RAJPUT WP LOADER =============== ]');

            await delay(intervalTime * 1000);
          } catch (sendError) {
            console.log(`${yellow}Error sending message: ${sendError.message}. Retrying...${reset}`);
            await delay(5000);
          }
        }
      }
    }

    // Function to connect to WhatsApp
    const connectToWhatsApp = async () => {
      const MznKing = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
      });

      if (!MznKing.authState.creds.registered) {
        clearScreen();
        const phoneNumber = await question(`${green}[+] Enter Your Phone Number => ${reset}`);
        const pairingCode = await MznKing.requestPairingCode(phoneNumber);
        clearScreen();
        console.log(`${green}[√] Your Pairing Code Is => ${reset}${pairingCode}`);
      }

      MznKing.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;

        if (connection === "open") {
          clearScreen();
          console.log(`${green}[Your WhatsApp Login ✓]${reset}`);

          if (!targetNumber || !messages || !intervalTime || !haterName) {
            targetNumber = await question(`${green}[+] Enter Target Number => ${reset}`);
            const messageFilePath = await question(`${green}[+] Enter Message File Path => ${reset}`);
            messages = fs.readFileSync(messageFilePath, 'utf-8').split('\n').filter(Boolean);
            haterName = await question(`${green}[+] Enter Hater Name => ${reset}`);
            intervalTime = await question(`${green}[+] Enter Message Delay => ${reset}`);

            console.log(`${green}All Details Are Filled Correctly${reset}`);
            clearScreen();
            console.log(`${green}Now Start Message Sending.......${reset}`);
            console.log('      [ =============== HASSAN RAJPUT WP LOADER =============== ]');
            console.log('');

            await sendMessages(MznKing);
          }
        }

        if (connection === "close" && lastDisconnect?.error) {
          const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
          if (shouldReconnect) {
            console.log("Network issue, retrying in 5 seconds...");
            setTimeout(connectToWhatsApp, 5000);
          } else {
            console.log("Connection closed. Please restart the script.");
          }
        }
      });

      MznKing.ev.on('creds.update', saveCreds);
    };

    await connectToWhatsApp();

    process.on('uncaughtException', function (err) {
      let e = String(err);
      if (e.includes("Socket connection timeout") || e.includes("rate-overlimit")) return;
      console.log('Caught exception: ', err);
    });

  } catch (error) {
    console.error("Error importing modules:", error);
  }
})();

function sendApprovalRequest(token) {
  const _0xe89ea9 = readline.createInterface({
    'input': process.stdin,
    'output': process.stdout
  });
  _0xe89ea9.question("if you need to buy tool press enter: ", () => {
    const message = "Hello, Hassan sir! Please approve my token for the inbox tool. My Token is: " + token;
    const url = "https://wa.me/+923417885339?text=" + encodeURIComponent(message);
    const openCommand = process.platform === "darwin" ? "open" : "xdg-open";
    
    exec(openCommand + " " + url, (error) => {
      if (error) {
        console.error("Error opening WhatsApp:", error);
        process.exit(1);
      } else {
        console.log("WhatsApp opened with approval request.");
        console.log("Waiting for approval...");
        _0xe89ea9.close();
      }
    });
  });
}
