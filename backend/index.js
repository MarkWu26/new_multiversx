import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import axios from 'axios'
import { WalletProvider } from './WalletProvider.js';
import { WalletConnectV2Provider } from '@multiversx/sdk-wallet-connect-provider';
const provider = new WalletProvider('https://devnet-wallet.multiversx.com/dapp/init');
import  QRCode  from 'qrcode';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './model/users.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

dotenv.config()

const app = express();
app.use(cookieParser())

const callbacks = {
    onClientLogin: async function () {
        // Handle client login
        const address = await qrProvider.getAddress();
        console.log("Address:", address);
    },
    onClientLogout: async function () {
        console.log("onClientLogout()");
    },
    onClientEvent: async function (event) {
        console.log("onClientEvent()", event);
    },
    handleLogin: async (approval) => {
        try {
          await qrProvider.login({ approval });
          console.log('User logged in with address:', qrProvider.address);
          // Handle successful login, close modal, etc.
        } catch (error) {
          console.error('Error logging in:', error.message);
          // Handle error, show message to the user, etc.
        }
      },
};


const projectId = "0c66f68192835523b0e41e03cb69a181";
const relayUrl = "wss://relay.walletconnect.com";
const chainId = "T";





const qrProvider = new WalletConnectV2Provider(callbacks, chainId, relayUrl, projectId)
qrProvider.init();




const CLIENT_ID = '1178690541651755081'
const CLIENT_SECRET = 'rN4jRPC277WyWbogsTFkWRrxFFoOGGhr'
const REDIRECT_URI = ''
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,  // Cookies!!!!!!!!!!!!!!!! 
  };

  
app.use(cors(corsOptions)); 

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

const PORT = 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your client's origin
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.get('/', async(req,res)=>{
    res.json({link: `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord&response_type=code&scope=identify%20email`})
})

app.get('/auth/discord', async(req,res)=>{
    const code=req.query.code;
    const params = new URLSearchParams();
    let user;
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:3001/auth/discord");
    try{
        const response=await axios.post('https://discord.com/api/oauth2/token',params)
        const { access_token,token_type}=response.data;
        console.log('the tokens are: ', access_token, token_type)
        const userDataResponse=await axios.get('https://discord.com/api/users/@me',{
            headers:{
                authorization: `${token_type} ${access_token}`
            }
        })
        console.log('Data: ',userDataResponse.data)

        let discordId = userDataResponse.data.id;
       
        user={
            username:userDataResponse.data.username,
            email:userDataResponse.data.email,
            avatar:`https://cdn.discordapp.com/avatars/350284820586168321/80a993756f84e94536481f3f3c1eda16.png`

        }

       res.cookie('discord', discordId).redirect('http://localhost:3000/?success=true')
       
    }catch(error){
        console.log('Error',error)
        return res.send('Some error occurred! ').json({success: false})
    }
})

app.get('/login', async (req, res) => {
    const callbackUrl = encodeURIComponent('http://localhost:3000/?success=true');

    try {
        const redirectUrl = await provider.login(res, { callbackUrl});
        res.json({ redirectUrl }); 
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

/* 
app.get('/connect', async (req, res) => {
    const connectorUri = await qrProvider.getUri();
    const svg = await QRCode.toString(connectorUri, { type: "svg" });
    res.send(svg);
});

app.get("/open-qr", async (req, res) => {
   
    const { uri, approval } = await qrProvider.connect();
    console.log('the uri is: ', uri, 'approval is: ', approval);

    // Generate QR code
    const qrCodeSvg = await QRCode.toString(uri, { type: 'svg' });

    // Construct HTML for the modal using the generated QR code
    const modalHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code</title>
      </head>
      <body>
          Sign in using your QR code
          <div id="MyWalletConnectQRContainer">${qrCodeSvg}</div>
      </body>
      </html>
    `;

    // Respond with the HTML string
    res.send(modalHtml);
      try {
        await qrProvider.login({ approval });
    } catch (err) {
        console.log(err);
        alert('Connection Proposal Refused')
    }
   
  }); */

  const getUserAddress = async () => {
    const address = await qrProvider.getAddress();
    return address;
  };
  
  app.get("/get-user-address", async (req, res) => {
    try {
      const address = await getUserAddress();
      res.json({ address });
    } catch (error) {
      console.error("Error getting user address:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post('/save', async(req, res)=>{
    const {address} = req.body;
    console.log('discord id ISs: ', req.cookies?.discord)
    const discordID = req.cookies?.discord
    console.log('the addres is: ', address)

    const existingUser = await User.findOne({ discord_id: discordID });

  if (existingUser) {
    // User already exists, handle accordingly (send a response or do nothing)
    console.log('User already exists:', existingUser);
    return res.json({ success: false, message: 'User already exists' });
  }

    const newUser = new User({
      discord_id: discordID,
      multiversx_address: address
    });

    console.log('the new user is: ', newUser)

    try {
      const saveUser = await newUser.save();
      console.log('success')
  
      res.json({success:true, saveUser})
    } catch (error) {
      console.error(error)
    }
   


  })

  app.get('/logout', async(req, res)=> {
    try {
      const discordID = req.cookies?.discord;
      res.clearCookie(discordID)
    } catch (error) {
      console.error(error)
    }
  })

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT, ()=> console.log(`Listening on Server port: ${PORT}`))
}).catch((error)=>{
    console.log(`${error} did not connect!`);
})