public with sharing class ContractController {
  @AuraEnabled(cacheable=true)
  public static List<ContractRelationship__c> getRelatedContacts(
    Id contractId
  ) {
    return [
      SELECT Id, Role__c, Contact__c, Contact__r.Name, Contact__r.Email
      FROM ContractRelationship__c
      WHERE Contract__c = :contractId
    ];
  }

  @AuraEnabled
  public static void updateContactRole(Id relationshipId, String newRole) {
    ContractRelationship__c itemToUpdate = new ContractRelationship__c();
    itemToUpdate.Id = relationshipId;
    itemToUpdate.Role__c = newRole;
    update itemToUpdate;
  }

  @AuraEnabled
  public static void deleteContractRelationship(Id relationshipId) {
    ContractRelationship__c itemToDelete = new ContractRelationship__c();
    itemToDelete.Id = relationshipId;
    delete itemToDelete;
  }
}
