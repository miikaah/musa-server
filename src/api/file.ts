import { Request } from "express";
import fs, { ReadStream } from "fs";
import fsp from "fs/promises";
import path from "path";
import { UrlSafeBase64 } from "../musa-core-import";
import { app } from "../express";
import { cacheControlMiddleware } from "../cacheControlMiddleware";
import { Stream } from "stream";

const SIX_MONTHS_IN_SECONDS = 60 * 60 * 24 * 183;
const { MUSA_SRC_PATH = "" } = process.env;

const options = {
  root: MUSA_SRC_PATH,
};

const parseRange = (range: string | undefined): [string, number, number] | undefined => {
  if (!range) {
    return;
  }
  const [type, r] = range.split("=");
  const ranges = r.split(",")
    .filter((rr): rr is string => typeof rr === "string")
    .map((rr) => rr.trim());
  const [start, end] = ranges[0].split("-");

  return [type, Number(start), Number(end)];
}

app.get(
  "/files/:name",
  cacheControlMiddleware(SIX_MONTHS_IN_SECONDS),
  async (req: Request<{ name: string }>, res, next) => {
    const { name } = req.params;
    const filename = UrlSafeBase64.decode(name);
    const range = req.headers["range"];

    if (range) {
      const parsedRange = parseRange(range);
      if (!parsedRange) {
        console.error("Invalid parsed range");
        res.status(500).end();
        return;
      }

      const [type, start, end] = parsedRange;
      const filepath = path.join(MUSA_SRC_PATH, filename);
      const stat = await fsp.stat(filepath);
      
      let len = stat.size;
      console.log("resume", range, len, start, end);
      if (end > 0) {
        var bytes = end - start + 1;
        if (len > bytes) {
          len = bytes;
        }
      }
      console.log("len", len);

      const opts: any = {};
      opts.start = start;
      opts.end = (end || Math.max(start, len)) - 1;
      console.log("opts", opts)

      const stream = fs.createReadStream(filepath, opts);

      let hasFinished = false;
      onFinished(res, function onfinished() {
        console.log("stream finished");
        hasFinished = true;
        destroy(stream);
      });
      stream.on("error", function onerror(err) {
        console.log("stream errored");
        if (hasFinished) {
          return;
        }
        hasFinished = true;
        destroy(stream);
        res.status(500).send(err.message);
      });
      stream.on("end", function onend() {
        console.log("stream ended");
        if (!res.headersSent) {
          res.end();
        }
      });

      res.setHeader("Accept-Ranges", type);
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", len - start);
      res.setHeader("Content-Range", `${type} ${range ? `${start}-${opts.end}` : "*"}/${len}`);
      res.setHeader("Last-Modified", stat.mtime.toISOString());
      res.status(206);
      stream.pipe(res);
      return;
    }

    res.sendFile(filename, options, (err) => {
      if (err?.message.includes("ENOENT")) {
        res.status(404).json({ message: "Not Found" });
      } else if (err) {
        next(err);
      }
    });
  },
);

function destroy(stream2: any) {
  if (stream2 instanceof ReadStream) {
    return destroyReadStream(stream2);
  }
  if (!(stream2 instanceof Stream)) {
    return stream2;
  }
  // @ts-ignore
  if (typeof stream2.destroy === "function") {
    // @ts-ignore
    stream2.destroy();
  }
  return stream2;
}
function destroyReadStream(stream2: ReadStream) {
  stream2.destroy();
  if (typeof stream2.close === "function") {
    stream2.on("open", onOpenClose);
  }
  return stream2;
}
function onOpenClose() {
  // @ts-ignore
  if (typeof this.fd === "number") {
    // @ts-ignore
    this.close();
  }
}

function first(stuff: any, done: any) {
  if (!Array.isArray(stuff))
    throw new TypeError("arg must be an array of [ee, events...] arrays");
  var cleanups: any[] = [];
  for (var i = 0; i < stuff.length; i++) {
    var arr = stuff[i];
    if (!Array.isArray(arr) || arr.length < 2)
      throw new TypeError("each array member must be [ee, events...]");
    var ee = arr[0];
    for (var j = 1; j < arr.length; j++) {
      var event = arr[j];
      var fn2 = listener(event, callback);
      ee.on(event, fn2);
      cleanups.push({
        ee,
        event,
        fn: fn2
      });
    }
  }
  function callback() {
    cleanup();
    done.apply(null, arguments);
  }
  function cleanup() {
    var x;
    for (var i2 = 0; i2 < cleanups.length; i2++) {
      x = cleanups[i2];
      x.ee.removeListener(x.event, x.fn);
    }
  }
  function thunk(fn3: any) {
    done = fn3;
  }
  thunk.cancel = cleanup;
  return thunk;
}
function listener(event: any, done: any) {
  return function onevent(arg1: any) {
    var args2 = new Array(arguments.length);
    // @ts-ignore
    var ee = this;
    var err = event === "error" ? arg1 : null;
    for (var i = 0; i < args2.length; i++) {
      args2[i] = arguments[i];
    }
    done(err, ee, event, args2);
  };
}
var defer = typeof setImmediate === "function" ? setImmediate : function(fn2: any) {
  process.nextTick(fn2.bind.apply(fn2, arguments));
};
function onFinished(msg: any, listener: any) {
  if (isFinished(msg) !== false) {
    // @ts-ignore
    defer(listener, null, msg);
    return msg;
  }
  attachListener(msg, listener);
  return msg;
}
function isFinished(msg: any) {
  var socket = msg.socket;
  if (typeof msg.finished === "boolean") {
    return Boolean(msg.finished || socket && !socket.writable);
  }
  if (typeof msg.complete === "boolean") {
    return Boolean(msg.upgrade || !socket || !socket.readable || msg.complete && !msg.readable);
  }
  return void 0;
}
function attachFinishedListener(msg: any, callback: any) {
  var eeMsg: any;
  var eeSocket: any;
  var finished = false;
  function onFinish(error: any) {
    eeMsg.cancel();
    eeSocket.cancel();
    finished = true;
    callback(error);
  }
  eeMsg = eeSocket = first([[msg, "end", "finish"]], onFinish);
  function onSocket(socket: any) {
    msg.removeListener("socket", onSocket);
    if (finished)
      return;
    if (eeMsg !== eeSocket)
      return;
    eeSocket = first([[socket, "error", "close"]], onFinish);
  }
  if (msg.socket) {
    onSocket(msg.socket);
    return;
  }
  msg.on("socket", onSocket);
  if (msg.socket === void 0) {
    patchAssignSocket(msg, onSocket);
  }
}
function attachListener(msg: any, listener: any) {
  var attached = msg.__onFinished;
  if (!attached || !attached.queue) {
    attached = msg.__onFinished = createListener(msg);
    attachFinishedListener(msg, attached);
  }
  attached.queue.push(listener);
}
function createListener(msg: any) {
  function listener(err: any) {
    if (msg.__onFinished === listener)
      msg.__onFinished = null;
    if (!listener.queue)
      return;
    var queue = listener.queue;
    // @ts-ignore
    listener.queue = null;
    for (var i = 0; i < queue.length; i++) {
      queue[i](err, msg);
    }
  }
  // @ts-ignore
  listener.queue = [];
  return listener;
}
function patchAssignSocket(res: any, callback: any) {
  var assignSocket = res.assignSocket;
  if (typeof assignSocket !== "function")
    return;
  res.assignSocket = function _assignSocket(socket: any) {
    assignSocket.call(this, socket);
    callback(socket);
  };
}