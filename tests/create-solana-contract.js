const anchor = require('@project-serum/anchor');

// Need the system program, will talk about this soon.
const { PublicKey, SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Createsolanacontract;
  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();
  let player_o = new PublicKey("8zkypLj4rxCdZ3ij5totHKk6Ns5Q5ZWPDVCbp5ZMqQ5P")


  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 Song Count', account.totalSongs.toString())

  // You'll need to now pass a Song link to the function! You'll also need to pass in the user submitting the Song!
  await program.rpc.addSong("https://i.redd.it/y26yr0bemwl61.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 Song Count', account.totalSongs.toString())

  // // Access song_list on the account!
  // console.log('👀 Song List', account.songList)

  // await program.rpc.upvoteSong("https://i.redd.it/y26yr0bemwl61.gif", {
  //   accounts: {
  //     baseAccount: baseAccount.publicKey,
  //   },
  // });

  // account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  // console.log('👀 Song List', account.songList)
  const to = new PublicKey(
      "8zkypLj4rxCdZ3ij5totHKk6Ns5Q5ZWPDVCbp5ZMqQ5P"
    );
  console.log(provider.wallet.publicKey);
  const amt = new anchor.BN(parseInt(457715000));
  console.log(amt);
  const trans = await program.rpc.sendSol(amt, {
    accounts: {
      from: provider.wallet.publicKey,
      to: to,
      systemProgram: SystemProgram.programId,
    }
  });

  console.log('trans', trans)
}


const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
