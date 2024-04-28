import emitter from '@/utils/bus';
import { Dispatch, SetStateAction } from 'react';

export default class wsRequest {
  status: WebSocket | null;
  /**
   * 锁住重新连接，延时结束后进行重新链接
   */
  lockReconnect: boolean;
  /**
   * WebSocket 对象
   */
  socket: WebSocket | undefined;
  url: string | undefined;
  /**
   * 多少秒发送一次心跳包，单位 ms
   */
  timeout: number;
  /**
   * 心跳包延时器对象
   */
  timeoutObj: NodeJS.Timeout | null;
  /**
   * 事件前缀
   */
  emitPrefix: string;
  /**
   * 重连延时器对象
   */
  reconnectTimeOutObj: NodeJS.Timeout | null;
  constructor(emitPrefix: string, time: number = 3000) {
    this.status = null; // websocket是否关闭
    this.lockReconnect = false; //避免重复连接
    this.emitPrefix = emitPrefix;

    //心跳检测
    this.timeout = time; //多少秒执行检测
    this.timeoutObj = null; //检测服务器端是否还活着
    this.reconnectTimeOutObj = null; //重连之后多久再次重连
  }

  connect(url: string) {
    this.url = url;

    try {
      this.initRequest();
    } catch (e) {
      console.log('catch');
      this.reconnect();
    }
  }

  initRequest() {
    this.socket = new WebSocket(this.url!);
    // 清除重连定时器
    if (this.reconnectTimeOutObj) {
      clearTimeout(this.reconnectTimeOutObj);
    }

    this.socket.onopen = (e) => {
      // console.log(e, '连接打开');
      emitter.emit(this.emitPrefix + 'onSocketReadyState', e);
      // 开启检测
      this.start();
    };

    // 如果希望websocket连接一直保持，在close或者error上绑定重新连接方法。
    this.socket.onclose = (e: any) => {
      // console.log(e, '连接关闭');
      emitter.emit(this.emitPrefix + 'onSocketReadyState', e);
      this.reconnect();
    };

    this.socket.onerror = (e: any) => {
      // console.log(e, '连接错误');
      emitter.emit(this.emitPrefix + 'onSocketReadyState', e);
      this.reconnect();
    };

    this.socket.onmessage = (e: any) => {
      emitter.emit(this.emitPrefix + 'onSocketMessage', e);
      //接受任何消息都说明当前连接是正常的
      this.reset();
      // console.log(e, 'pong');
    };
  }

  sendMsg(value: any, type: string) {
    if (!this.socket || this.socket.readyState === 0) {
      emitter.emit(this.emitPrefix + 'sendMsgFail');
      return;
    }

    if ([2, 3].includes(this.socket.readyState)) {
      this.reconnect();
      emitter.emit(this.emitPrefix + 'sendMsgFail');
      return;
    }

    this.socket.send(value);
    emitter.emit(this.emitPrefix + 'sendMsgSuc', type);
  }

  // reset和start方法主要用来控制心跳的定时。
  reset() {
    // 清除定时器重新发送一个心跳信息
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.start();
  }
  start() {
    this.timeoutObj = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      // console.log('ping');
      this.socket?.send('PING');
    }, this.timeout);
  }

  // 重连
  reconnect() {
    // 防止多个方法调用，多处重连
    if (this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;

    console.log('准备重连');

    //没连接上会一直重连，设置延迟避免请求过多
    this.reconnectTimeOutObj = setTimeout(() => {
      // 重新连接
      this.initRequest();

      this.lockReconnect = false;
    }, 4000);
  }

  // 手动关闭
  close() {
    this.socket?.close();
  }
}
