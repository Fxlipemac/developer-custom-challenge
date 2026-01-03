trigger ContractRelationshipTrigger on ContractRelationship__c(
  before insert,
  before update
) {
  // Get the contract and contact ids from the trigger.new list
  Set<Id> contractIds = new Set<Id>();
  Set<Id> contactIds = new Set<Id>();

  // Loop through the trigger.new list and add the contract and contact ids to the sets
  for (ContractRelationship__c records : Trigger.new) {
    if (records.Contract__c != null && records.Contact__c != null) {
      contractIds.add(records.Contract__c);
      contactIds.add(records.Contact__c);
    }
  }
  // Query existing ContractRelationship__c records that match the contract and contact ids
  List<ContractRelationship__c> existingRelationships = [
    SELECT Id, Contract__c, Contact__c
    FROM ContractRelationship__c
    WHERE Contract__c IN :contractIds AND Contact__c IN :contactIds
  ];

  Map<String, ContractRelationship__c> existingRelationshipsMap = new Map<String, ContractRelationship__c>();

  for (ContractRelationship__c keyrecords : existingRelationships) {
    String key = keyrecords.Contract__c + '' + keyrecords.Contact__c;

    existingRelationshipsMap.put(key, keyrecords);
  }

  for (ContractRelationship__c verifyrecords : Trigger.new) {
    if (verifyrecords.Contract__c != null && verifyrecords.Contact__c != null) {
      String key = verifyrecords.Contract__c + '' + verifyrecords.Contact__c;
      if (existingRelationshipsMap.containsKey(key)) {
        verifyrecords.addError('Este relacionamento já existe.');
      }
    }
  }

}
