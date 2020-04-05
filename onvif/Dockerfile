FROM debian:buster

RUN apt-get update && apt-get install -y \
      socat \
    && rm -rf /var/lib/apt/lists/*

ADD onvif-proxy /usr/local/bin/onvif-proxy

EXPOSE 8080

CMD ["onvif-proxy"]
