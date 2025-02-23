import Image from 'next/image';
import { poppins } from '@/app/componets/fonts';

export default function YuNeedMoneyLogo(){
    return (
        <div className={`${poppins.className} flex flex-row items-center leading-none text-black`}>
          <p className="text-[44px]">YUNeedMoney</p>
        </div>
    );
}