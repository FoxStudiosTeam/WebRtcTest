import Link from "next/link";


export function Header(){
    return(
        <div className="flex items-center bg-[#343A40] h-[50px] w-full">
            <div className="flex items-center min-w-[20%] text-[#f8f9fa]">
                <Link href="/" className="mx-5"><h1 className="font-[500] text-[20px]">SevenSupport</h1></Link>
                <Link href="/" className="mx-5">Главная</Link>
                <Link href="/pages/support/terminals" className="mx-5">Терминалы</Link>
            </div>
        </div>
    );
}