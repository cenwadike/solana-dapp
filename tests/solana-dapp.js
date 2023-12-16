const anchor = require('@project-serum/anchor');
const {SystemProgram} = anchor.web3;

const TestProgram = async() => {
    /**
     * setup
     */
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.SolanaDapp;
    const account = anchor.web3.Keypair.generate();

    /**
     * initialization
     */

    let txInit = await program.rpc.initialize({
        accounts: {
            blobAccount: account.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [account]
    }) 
    console.log("Initialization transaction id: ", txInit);

    // fetch initialization data
    let initialData = await program.account.init.fetch(account.publicKey);
    console.log("returned data: ", initialData);

    /**
     * Update storage
     */

    const header = new anchor.utils.sha256("data");
    const object = new String("data");

    let txUpdate = await program.account.updateBlob(header, object, {
        accounts: {
            storageAccount: account.publicKey
        },
        signers: [account]
    })

    console.log("Update transaction id: ", txUpdate);
    // fetch initialization data
    let updatedData = await program.account.init.fetch(account.publicKey);
    console.log("returned data: ", updatedData);
} 

const runTest = async() => {
    try {
        await TestProgram();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runTest()