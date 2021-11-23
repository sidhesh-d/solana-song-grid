Solana program to store song links with upvotes in blockchain. Includes tipping a user some solana feature.

Install Rust
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Install Solana: https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool

Install Anchor
```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

Install Solana Web3 js
```bash
npm install @project-serum/anchor @solana/web3.js
```

Create local keypair
```bash
solana-keygen new
```

Set Solana to run on devnet
```bash
solana config set --url devnet
solana config get
```

To run tests
```bash
anchor test
```

To deploy contract
```bash
anchor deploy
```
