
# FiveMClient-POC

## Description

![FiveM DDoS Image](https://www.ouiheberg.com/assets/img/fivemddos.png)

This is a Proof of Concept (POC) for interacting with a FiveM client using HTTP requests and proxies. The script simulates requests to a server, rotating through a list of proxies, and logs progress and results.

The main focus of this POC is to make various HTTP requests to a FiveM server, simulating client behavior by using proxy rotation and testing multiple endpoints. This could be useful for testing the server's robustness, latency, or handling of proxy-based traffic.

## Features
- Proxy rotation from `http.txt`.
- Simulates multiple HTTP requests to a FiveM server using the `axios` library.
- Logs successful and failed requests, along with proxy information.
- Ability to run multiple workers in parallel to simulate high traffic.
- Safe mode option to limit the execution time and control the behavior.
- Customizable target server IP, port, and execution time.

## Installation

### Prerequisites
Before running the script, you need the following dependencies:
- Node.js (v14.x or higher)
- `axios`
- `uuid`
- `readline`
- `chalk`

### Steps to Install
1. Clone the repository:
    ```bash
    git clone https://github.com/minatsukix86/FiveM-Client-POC.git
    ```
2. Navigate to the project directory:
    ```bash
    cd FiveMClient-POC
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

To run the script, execute the following command with the required parameters:

```bash
node poc.js <IP> <PORT> <SafeMode (true/false)> <TimeLimit (in seconds)>
```

### Example:
```bash
node poc.js 127.0.0.1 30120 true 3600
```

- `<IP>`: Target server's IP address.
- `<PORT>`: Port of the target server.
- `<SafeMode>`: If true, the script will limit the execution time and control its behavior.
- `<TimeLimit>`: The maximum execution time in seconds.

### Expected Output
- Logs will be displayed in the terminal, showing the request status and proxy usage.
- Example:
    ```bash
    (1/4) [proxy_address] -> Init Client Request!
    (2/4) [proxy_address] -> Posted Client Data!
    (3/4) [proxy_address] -> Init Client Request 2!
    (4/4) [proxy_address] -> Posted Client Data Config!
    (Final) [proxy_address] -> Init Client Request Success!
    ```

## Contributing
Feel free to fork this project, submit issues, or make pull requests. If you encounter any bugs or have suggestions for improvements, don't hesitate to open an issue.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
- **Minatsukix86**

