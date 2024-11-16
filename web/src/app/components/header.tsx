import Link from "next/link";


export function Header(){
    return(
        <div className="flex items-center bg-[#343A40] h-[50px] w-full">
            <div className="flex items-center min-w-[20%] text-[#f8f9fa]">
                <h1 className="font-[500] text-[20px] mx-5">SevenSupport</h1>
                <Link href="/" className="mx-5">Главная</Link>
                <Link href="#" className="mx-5">Терминалы</Link>
            </div>
        </div>
    );
}