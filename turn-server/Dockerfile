FROM coturn/coturn

EXPOSE 3478:3478
EXPOSE 3478:3478/udp
EXPOSE 5349:5349
EXPOSE 5349:5349/udp

ENTRYPOINT ["turnserver", "--min-port=49000", "--max-port=52000", "--listening-port=3478", "--listening-ip=0.0.0.0", "--relay-ip=0.0.0.0", "--fingerprint", "--cert=/etc/ssl/coturn/coturn.crt", "--pkey=/etc/ssl/coturn/coturn.key"]