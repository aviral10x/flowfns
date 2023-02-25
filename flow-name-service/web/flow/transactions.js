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

export async function registerDomain(name, duration) {
    return fcl.mutate({
      cadence: REGISTER_DOMAIN,
      args: (arg, t) => [arg(name, t.String), arg(duration, t.UFix64)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
  }
  
  const REGISTER_DOMAIN = `
  import Domains from 0xDomains
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  
  transaction(name: String, duration: UFix64) {
      let nftReceiverCap: Capability<&{NonFungibleToken.Receiver}>
      let vault: @FungibleToken.Vault
      prepare(account: AuthAccount) {
          self.nftReceiverCap = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.DomainsPublicPath)
          let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow Flow token vault reference")
          let rentCost = Domains.getRentCost(name: name, duration: duration)
          self.vault <- vaultRef.withdraw(amount: rentCost)
      }
      execute {
          Domains.registerDomain(name: name, duration: duration, feeTokens: <- self.vault, receiver: self.nftReceiverCap)
      }
  }
  `;


  export async function fundGrant(name, duration) {
    return fcl.mutate({
      cadence: REGISTER_DOMAIN,
      args: (arg, t) => [arg(name, t.String), arg(duration, t.UFix64)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
  }
  
  const FUND_GRANT = `
  import Domains from 0xDomains
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  
  transaction(name: String, duration: UFix64) {
      let nftReceiverCap: Capability<&{NonFungibleToken.Receiver}>
      let vault: @FungibleToken.Vault
      prepare(account: AuthAccount) {
          self.nftReceiverCap = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.DomainsPublicPath)
          let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow Flow token vault reference")
          let rentCost = Domains.getRentCost(name: name, duration: duration)
          self.vault <- vaultRef.withdraw(amount: rentCost)
      }
      execute {
          Domains.registerDomain(name: name, duration: duration, feeTokens: <- self.vault, receiver: self.nftReceiverCap)
      }
  }
  `;



// // Transfer Tokens

// import ExampleToken from 0x02

// // This transaction is a template for a transaction that
// // could be used by anyone to send tokens to another account
// // that owns a Vault
// transaction {

//   // Temporary Vault object that holds the balance that is being transferred
//   var temporaryVault: @ExampleToken.Vault

//   prepare(acct: AuthAccount) {
//     // withdraw tokens from your vault by borrowing a reference to it
//     // and calling the withdraw function with that reference
//     let vaultRef = acct.borrow<&ExampleToken.Vault>(from: /storage/CadenceFungibleTokenTutorialVault)
//         ?? panic("Could not borrow a reference to the owner's vault")
      
//     self.temporaryVault <- vaultRef.withdraw(amount: 10.0)
//   }

//   execute {
//     // get the recipient's public account object
//     let recipient = getAccount(0x02)

//     // get the recipient's Receiver reference to their Vault
//     // by borrowing the reference from the public capability
//     let receiverRef = recipient.getCapability(/public/CadenceFungibleTokenTutorialReceiver)
//                       .borrow<&ExampleToken.Vault{ExampleToken.Receiver}>()
//                       ?? panic("Could not borrow a reference to the receiver")

//     // deposit your tokens to their Vault
//     receiverRef.deposit(from: <-self.temporaryVault)

//     log("Transfer succeeded!")
//   }
// }





  export async function updateBioForDomain(nameHash, bio) {
    return fcl.mutate({
      cadence: UPDATE_BIO_FOR_DOMAIN,
      args: (arg, t) => [arg(nameHash, t.String), arg(bio, t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
  }
  
  const UPDATE_BIO_FOR_DOMAIN = `
  import Domains from 0xDomains
  
  transaction(nameHash: String, bio: String) {
      var domain: &{Domains.DomainPrivate}
      prepare(account: AuthAccount) {
          var domain: &{Domains.DomainPrivate}? = nil
          let collectionPvt = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.DomainsStoragePath) ?? panic("Could not load collection private")
  
          let id = Domains.nameHashToIDs[nameHash]
          if id == nil {
              panic("Could not find domain")
          }
  
          domain = collectionPvt.borrowDomainPrivate(id: id!)
          self.domain = domain!
      }
      execute {
          self.domain.setBio(bio: bio)
      }
  }
  `;

  export async function updateAddressForDomain(nameHash, addr) {
    return fcl.mutate({
      cadence: UPDATE_ADDRESS_FOR_DOMAIN,
      args: (arg, t) => [arg(nameHash, t.String), arg(addr, t.Address)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
  }
  
  const UPDATE_ADDRESS_FOR_DOMAIN = `
  import Domains from 0xDomains
  
  transaction(nameHash: String, addr: Address) {
      var domain: &{Domains.DomainPrivate}
      prepare(account: AuthAccount) {
          var domain: &{Domains.DomainPrivate}? = nil
          let collectionPvt = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.DomainsStoragePath) ?? panic("Could not load collection private")
  
          let id = Domains.nameHashToIDs[nameHash]
          if id == nil {
              panic("Could not find domain")
          }
  
          domain = collectionPvt.borrowDomainPrivate(id: id!)
          self.domain = domain!
      }
      execute {
          self.domain.setAddress(addr: addr)
      }
  }
  `;

  export async function renewDomain(name, duration) {
    return fcl.mutate({
      cadence: RENEW_DOMAIN,
      args: (arg, t) => [arg(name, t.String), arg(duration, t.UFix64)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 1000,
    });
  }
  
  const RENEW_DOMAIN = `
  import Domains from 0xDomains
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  
  transaction(name: String, duration: UFix64) {
    let vault: @FungibleToken.Vault
    var domain: &Domains.NFT
    prepare(account: AuthAccount) {
        let collectionRef = account.borrow<&{Domains.CollectionPublic}>(from: Domains.DomainsStoragePath) ?? panic("Could not borrow collection public")
        var domain: &Domains.NFT? = nil
        let collectionPrivateRef = account.borrow<&{Domains.CollectionPrivate}>(from: Domains.DomainsStoragePath) ?? panic("Could not borrow collection private")
  
        let nameHash = Domains.getDomainNameHash(name: name)
        let domainId = Domains.nameHashToIDs[nameHash]
        log(domainId)
        if domainId == nil {
            panic("You don't own this domain")
        }
  
        domain = collectionPrivateRef.borrowDomainPrivate(id: domainId!)
        self.domain = domain!
        let vaultRef = account.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow Flow token vault reference")
        let rentCost = Domains.getRentCost(name: name, duration: duration)
        self.vault <- vaultRef.withdraw(amount: rentCost)
    }
    execute {
        Domains.renewDomain(domain: self.domain, duration: duration, feeTokens: <- self.vault)
    }
  }
  `;