'use client';
import { useEffect, useState } from 'react';
import { Client } from './_components/Client';
import { ClientCreatePet } from './_components/CreatePet';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';

export default function Home() {
  const { userState } = useUserStore();
  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isPet, setIsPet] = useState(false);
  useEffect(() => {
    const isPet = Number(Cookies.get('isPet'));
    if (!Number.isNaN(isPet)) {
      setIsPet(isPet > 0);
      setLoading(false);

      if (isPet > 0 && !friendId) {
        fetchRequest('/restApi/friend/list/v2').then(({ result }) => {
          if (result.conversations.rows.length) {
            setFriendId(result.conversations.rows[0].id);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      {!isPet ? (
        <ClientCreatePet
          setIsPet={setIsPet}
          setFriendId={setFriendId}
        ></ClientCreatePet>
      ) : (
        <Client friendId={friendId}></Client>
      )}
    </>
  );
}
