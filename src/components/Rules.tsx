import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FC } from 'react';

export const Rules: FC<{
  className?: string;
  title?: string;
  children?: React.ReactNode;
}> = ({ className, title, children }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <AiFillQuestionCircle
          className={`${className} size-[13px] ml-1 text-[#D3B49C]`}
        ></AiFillQuestionCircle>
      </DialogTrigger>
      <DialogContent className="text-[#bf8154] !py-6 !px-3 !bg-[#f9f6ec]">
        <DialogHeader>
          <DialogTitle className="mb-4 text-left text-xl px-3">
            {title || 'Rules'}
          </DialogTitle>
          <div className="text-left w-[85vw] max-h-[60vh] overflow-y-auto px-3">
            {children || (
              <>
                <h2 className="font-bold text-lg mb-4">
                  AI PETS: A Complete Guide
                </h2>
                <p className="my-2 ">Hello, AI PETS players! </p>
                <p className="my-2 ">
                  AI PETS is the first AI pet game on the TON blockchain,
                  combining virtual pets with AI and VR technology, integrating
                  Chat 2 Earn and the metaverse, providing a highly immersive
                  interactive experience in blockchain gaming. AI PET is the
                  fastest-growing game on Telegram, where you can adopt an AI
                  pet for your own. By chatting and interacting, you can level
                  up your pet, which will bring you generous rewards.
                </p>

                <h2 className="font-bold text-lg my-4">How to Play AI PETS?</h2>
                <ul className="list-disc pl-4">
                  <li className="my-3">
                    <strong>Adopt Your Exclusive Pet:</strong>
                    <br /> As the first AI pet game, you can earn $AIPET tokens
                    by feeding and chatting with your pet.
                  </li>
                  <li className="my-3">
                    <strong>Level Up:</strong>
                    <br /> The higher your pet&apos;s level, the more $AIPET it
                    produces.
                  </li>
                  <li className="my-3">
                    <strong>Dog Food:</strong>
                    <br /> Level up and complete tasks to earn more dog food.
                  </li>
                  <li className="my-3">
                    <strong>Friends:</strong>
                    <br /> Invite friends to earn $AIPET rewards and more dog
                    food.
                  </li>
                </ul>

                <h2 className="font-bold text-lg my-4">Why Play AI PET?</h2>
                <ol className="list-decimal pl-4">
                  <li className="my-3">
                    It&apos;s a real casual game, and your AI pet can accompany
                    you for a lifetime.
                  </li>
                  <li className="my-3">It&apos;s completely free.</li>
                  <li className="my-3">It&apos;s really fun.</li>
                  <li className="my-3">
                    You can earn a significant amount of $AIPET.
                  </li>
                </ol>

                <h2 className="font-bold text-lg my-4">How to Earn $AIPET?</h2>
                <ol className="list-decimal pl-4">
                  <li className="my-3">
                    <strong>Invite Friends:</strong> Invite friends to earn
                    generous rewards.
                  </li>
                  <li className="my-3">
                    <strong>Complete Tasks:</strong> Complete corresponding
                    tasks to earn rewards.
                  </li>
                  <li className="my-3">
                    <strong>Special Rewards:</strong> Participate in official
                    events to earn more tokens from different projects.
                  </li>
                </ol>

                <h2 className="font-bold text-lg my-4">
                  How to Get a Lot of $AIPET?
                </h2>
                <p className="my-2 ">
                  Dog food is produced not only during interactions and random
                  events but can also be purchased with $TON. Feed your pet dog
                  food to quickly increase the $AIPET output and pet’s levels!
                  Otherwise, you will only slowly get $AIPET and wait more time
                  to reach the next level.
                </p>

                <p className="my-2 ">
                  <strong>What&apos;s next:</strong> We are working hard to
                  update more gameplay, so stay tuned.
                </p>
              </>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
