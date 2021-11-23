const anchor = require('@project-serum/anchor');
const assert = require("assert");
// Need the system program, will talk about this soon.
const { PublicKey, SystemProgram } = anchor.web3;
const { expect } = require('chai');

describe("solana-song-grid", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Createsolanacontract;
  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  it('Test startStuffOff func', async () => {
    // Call start_stuff_off, pass it the params it needs!
    let tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 Song Count', account.totalSongs.toString())
    assert.equal(account.totalSongs.toString(), "0");
  });

  it('Test adding song', async () => {
    // You'll need to now pass a Song link to the function! You'll also need to pass in the user submitting the Song!
    await program.rpc.addSong("https://i.redd.it/y26yr0bemwl61.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    // Call the account.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.equal(account.totalSongs.toString(), "1");
  });

  it('Test upvoting song', async () => {
    await program.rpc.addSong("https://i.redd.it/y26yr0bemwl6.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    await program.rpc.upvoteSong("https://i.redd.it/y26yr0bemwl6.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    songRecord = account.songList.filter((element) => {
      element.songLink == 'https://i.redd.it/y26yr0bemwl61.gif'
    });
    console.log('sonerecord'+songRecord);
    assert.equal(songRecord.upvotes, 1);
  });

  it('Test sending sol', async () => {
    account = await program.account.provider.fetch(provider.wallet.publicKey);
    const amt = new anchor.BN(parseInt(457715000));
    const trans = await program.rpc.sendSol(amt, {
      accounts: {
        from: provider.wallet.publicKey,
        to: to,
        systemProgram: SystemProgram.programId,
      }
    });
    account = await program.account.provider.fetch(provider.wallet.publicKey);
    console.log('account', account.data);
    assert.equal(account.data, 1);
  });
});


