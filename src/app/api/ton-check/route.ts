import {
  Body,
  ConvertTonProofMessage,
  CreateMessage,
  SignatureVerify,
  checkPayload,
} from './tonProof';
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getAppConfigEnv } from '@/utils/get-config';
import { cookies } from 'next/headers';

async function check(req: NextRequest) {
  const body = (await req.json()) as Body;
  const AppConfigEnv = getAppConfigEnv(process.env.NEXT_ORIGIN);

  if (!body?.proof) {
    return Response.json(
      { ok: false },
      {
        status: 400,
      }
    );
  }
  const proof = body.proof;

  if (!proof) {
    return Response.json(
      { ok: false },
      {
        status: 400,
      }
    );
  }

  const err = checkPayload(proof.payload, process.env.SECRET!);
  if (err != null) {
    return Response.json(
      { ok: false },
      {
        status: 403,
      }
    );
  }

  const { data } = await axios(`https://tonapi.io/v2/tonconnect/stateinit`, {
    method: 'POST',
    data: {
      state_init: body.proof.state_init,
    },
  });

  console.log(data);

  const pubkey = Buffer.from(data.public_key, 'hex');

  const parsedMessage = ConvertTonProofMessage(body, proof);
  const checkMessage = await CreateMessage(parsedMessage);

  const verifyRes = SignatureVerify(
    pubkey,
    checkMessage,
    parsedMessage.Signature
  );

  if (!verifyRes) {
    return Response.json(
      { ok: false },
      {
        status: 400,
      }
    );
  }

  /**
   * @see https://docs.tonconsole.com/tonapi/api-v2
   */
  const { data: AddressData } = await axios(
    `https://tonapi.io/v2/address/${encodeURI(body.address)}/parse`
  );

  const token = cookies().get('token')?.value;

  const { data: ApiData } = await axios(
    AppConfigEnv.HOST + '/restApi/member/bindTonAddress',
    {
      method: 'POST',
      data: {
        tonAddress: AddressData.non_bounceable.b64,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return Response.json(
    {
      ...ApiData,
      ok: true,
      result: AddressData.non_bounceable.b64,
    },
    {
      status: 200,
    }
  );
}

export { check as POST };
