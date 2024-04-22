'use client';
import { ClientSendMsg } from './ClientSend';

export const Client = () => {
  const sendMsg = () => {};

  return (
    <>
      <ClientSendMsg sendMsg={sendMsg}></ClientSendMsg>
    </>
  );
};
