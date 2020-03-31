# Victure PC540 Proxy

There's a bug with the RTSP implementation on the Victure PC540 IP camera. The bug makes it so that you cannot consume the camera feed from some RTSP client implementations, including `ffmpeg`.

When using `ffmpeg` on the RTSP URL for the camera, you get an error message:

```sh
$ ffmpeg 'rtsp://<username>:<password>@192.168.50.60:554/realmonitor?channel=0&stream=0.sdp'
```

```
av.AVError: [Errno 1094995529] Invalid data found when processing input: 'rtsp://<username>:<password>@192.168.50.60:554/realmonitor?channel=0&stream=0.sdp'
```

The problem is that the `Transport` response header on `SETUP` requests in incorrectly formatted (according to section 12.39 of [RFC 2326][]).

[RFC 2326]: https://tools.ietf.org/html/rfc2326#page-58

The camera produces something like this:

```
RTP/AVP;unicast;mode=PLAY;source=192.168.50.60;client_port=7380-7381;server_port=40000-40001,ssrc=FFFFCCCC
```

But that last `,` should be a `;`:

```
RTP/AVP;unicast;mode=PLAY;source=192.168.50.60;client_port=7380-7381;server_port=40000-40001;ssrc=FFFFCCCC
```

This project provides a proxy server that rewrites the responses from the camera so that the messages conform to the specification.

## Usage

TODO
