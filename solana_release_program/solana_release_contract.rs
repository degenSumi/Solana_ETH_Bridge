use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
    system_instruction,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    if instruction_data.len() != 8 {
        return Err(ProgramError::InvalidInstructionData);
    }

    let amount = u64::from_le_bytes(instruction_data.try_into().unwrap());

    let accounts_iter = &mut accounts.iter();
    let sender_account = next_account_info(accounts_iter)?;
    let recipient_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;


    // Transfer SOL to recipient
    let transfer_instruction = system_instruction::transfer(
        sender_account.key,
        recipient_account.key,
        amount,
    );

    msg!("done stage 1");
    solana_program::program::invoke(&transfer_instruction, accounts)?;

    Ok(())
}