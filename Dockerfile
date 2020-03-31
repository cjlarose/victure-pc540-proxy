FROM debian:buster

RUN apt-get update && apt-get install -y \
      socat \
    && rm -rf /var/lib/apt/lists/*

ADD rtsp-proxy /usr/local/bin/rtsp-proxy

EXPOSE 554

CMD ["rtsp-proxy"]
