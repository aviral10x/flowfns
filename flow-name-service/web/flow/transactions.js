import * as fcl from "@onflow/fcl";

export async function initializeAccount() {
  return fcl.mutate({
    cadence: INIT_ACCOUNT,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 50,
  });
}

const INIT_ACCOUNT = `
import Domains from 0xDomains
import NonFungibleToken from 0xNonFungibleToken

transaction() {
    prepare(account: AuthAccount) {
        account.save<@NonFungibleToken.Collection>(<- Domains.createEmptyCollection(), to: Domains.DomainsStoragePath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.DomainsPublicPath, target: Domains.DomainsStoragePath)
        account.link<&Domains.Collection>(Domains.DomainsPrivatePath, target: Domains.DomainsStoragePath)
    }
}
`;