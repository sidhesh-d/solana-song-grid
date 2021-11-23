use anchor_lang::prelude::*;

declare_id!("2zhZob4DSvtaweXYK2QnPXx8xjhogyvLNLYfx1E7ehp7");

#[program]
pub mod createsolanacontract {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
    // Get a reference to the account.
    let base_account = &mut ctx.accounts.base_account;
    // Initialize total_songs.
    base_account.total_songs = 0;
    Ok(())
  }


  // The function now accepts a song_link param from the user. We also reference the user from the Context
  pub fn add_song(ctx: Context<AddSong>, song_link: String) -> ProgramResult {
    msg!("add_song");
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Build the struct.
    let item = ItemStruct {
      song_link: song_link.to_string(),
      user_address: *user.to_account_info().key,
      upvotes: 0
    };

	// Add it to the song_list vector.
    base_account.song_list.push(item);
    base_account.total_songs += 1;
    Ok(())
  }

  // The function accepts the song link as parameter. Increments upvote count.
  pub fn upvote_song(ctx: Context<Upvote>, song_link: String) -> ProgramResult {
    let base_account = &mut ctx.accounts.base_account;
    for song in &mut base_account.song_list {
      if song.song_link == song_link {
        song.upvotes += 1;
        break;
      }
    }
    Ok(())
  }

  // The function accepts the amount to be transferred. Context has the from and to user public keys
  pub fn send_sol(ctx: Context<SendSol>, amount: u64) -> ProgramResult {
    msg!("Send sol");
    let ix = anchor_lang::solana_program::system_instruction::transfer(
      &ctx.accounts.from.key(),
      &ctx.accounts.to.key(),
      amount,
    );
    anchor_lang::solana_program::program::invoke(
      &ix,
      &[
          ctx.accounts.from.to_account_info(),
          ctx.accounts.to.to_account_info(),
      ],
    )
  }

}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Specify what data you want in the AddSong Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddSong<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Upvote<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[derive(Accounts)]
pub struct SendSol<'info> {
  #[account(mut)]
  pub from: Signer<'info>,
  #[account(mut)]
  pub to: UncheckedAccount<'info>,
  pub system_program: Program <'info, System>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub song_link: String,
    pub user_address: Pubkey,
    pub upvotes: u64
}

#[account]
pub struct BaseAccount {
    pub total_songs: u64,
	// Attach a Vector of type ItemStruct to the account.
    pub song_list: Vec<ItemStruct>,
}
