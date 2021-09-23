import Head from "next/head";
import BattleSimulator from "../components/BattleSimulator";

export default function Home() {
  return (
    <div id="root" className={"text-gray-300 bg-black h-screen w-screen pt-5"}>
      <Head>
        <title>Battle Simulator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BattleSimulator />
    </div>
  );
}
