import { NextRequest } from 'next/server';
import { validate } from './check';
import axios from 'axios';
import { getAppConfigEnv } from '@/utils/get-config';

const handle = async (req: NextRequest) => {
  const body = await req.json();

  const BaseUrl =
    'http://ai-love-pet-322313939.us-west-2.elb.amazonaws.com/ai-love';

  try {
    // validate(body.initData, process.env.NEXT_PUBLIC_TOKEN!);

    const searchParams = new URLSearchParams(body.initData);
    const user = JSON.parse(searchParams.get('user')!);

    const { data: ApiData } = await axios(
      BaseUrl + '/restApi/platform/google/auth/authLogin',
      {
        method: 'POST',
        data: {
          loginType: 'telegram-mini-apps',
          email: '',
          nickname:
            user.first_name + (user.last_name ? ' ' + user.last_name : ''),
          openId: user.id,
          avatarUrl: user.photo_url,
          loginName: user.username,
        },
      }
    );

    return Response.json(ApiData, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(
      {
        code: '500',
        message: error.message || '',
      },
      { status: 500 }
    );
  }
};
export { handle as POST };
