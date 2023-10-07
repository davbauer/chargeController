# chargeController

## Summary

A way to dynamically control the charging power of an electric vehicle charger based on Photovoltaic panels!

Currently only suppots exact configuration:

- go-eCharger (with following API: https://github.com/goecharger/go-eCharger-API-v2)
- Fronius Inverter (with following API: **Fronius Solar API V1**)

## Build Status

| Branch | Build Status                                                                                                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| main   | ![Build Status - main](https://github.com/davbauer/chargeController/actions/workflows/main-build-push.yml/badge.svg?branch=main) |
| dev    | ![Build Status - dev](https://github.com/davbauer/chargeController/actions/workflows/dev-build-push.yml/badge.svg?branch=dev)    |

## Developement

### Setting up developement envirement

New terminal window

```bash
yarn           # Install packages
yarn dev       # Run frontend
```

New terminal window

```bash
cd ./backend   # Change dir to 'backend'
yarn           # Install packages
yarn dev       # Run backend
```

## Production

### Building the docker image

```bash
docker build --build-arg GIT_COMMITID=$(git rev-parse HEAD) --build-arg GIT_BRANCH=$(git symbolic-ref --short HEAD) -t charge-controller .
```

### Using docker-compose.yml

```yml
version: '3'

services:
  charge-controller:
    restart: unless-stopped
    container_name: charge-controller
    image: charge-controller
    environment:
      - WEBSOCK_PORT=81
    ports:
      - '2000:80'
      - '81:81'
    volumes:
      - ./config:/app/config
```

> [!IMPORTANT]  
> If you want to change the port of the Websocket please change the port everywhere (**port mapping & environment**).

## Other

### Preview

![preview](./assets/preview.png)
