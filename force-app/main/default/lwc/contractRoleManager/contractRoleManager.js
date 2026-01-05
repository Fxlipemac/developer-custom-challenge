import { LightningElement, api, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRelatedContacts from "@salesforce/apex/ContractController.getRelatedContacts";
import updateContactRole from "@salesforce/apex/ContractController.updateContactRole";
import deleteContractRelationship from "@salesforce/apex/ContractController.deleteContractRelationship";

export default class ContractRoleManager extends LightningElement {
  @api recordId;
  contacts = [];
  isModalOpen = false;

  wiredContactsResult;

  @wire(getRelatedContacts, { contractId: "$recordId" })
  wiredContacts(result) {
    this.wiredContactsResult = result;

    if (result.data) {
      this.contacts = result.data;
    } else if (result.error) {
      console.error(result.error);
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSuccess() {
    this.closeModal();
    return refreshApex(this.wiredContactsResult);
  }

  get noRoleContacts() {
    return this.contacts.filter((contact) => !contact.Role__c);
  }

  get commercialContacts() {
    return this.contacts.filter((contact) => contact.Role__c === "Comercial");
  }

  get financialContacts() {
    return this.contacts.filter((contact) => contact.Role__c === "Financeiro");
  }

  handleError(event) {
    let message = "Erro desconhecido ao salvar.";

    if (
      event.detail.output &&
      event.detail.output.errors &&
      event.detail.output.errors.length > 0
    ) {
      message = event.detail.output.errors[0].message;
    } else if (event.detail.message) {
      message = event.detail.message;
    }

    this.showToast("Atenção", message, "error");
  }

  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }

  handleMoveToCommercial(event) {
    const relId = event.target.dataset.id;

    updateContactRole({ relationshipId: relId, newRole: "Comercial" })
      .then(() => {
        return refreshApex(this.wiredContactsResult);
      })
      .catch((error) => {
        console.error("Erro ao mover:", error);
      });
  }

  handleMoveToFinancial(event) {
    const relId = event.target.dataset.id;

    updateContactRole({ relationshipId: relId, newRole: "Financeiro" })
      .then(() => {
        return refreshApex(this.wiredContactsResult);
      })
      .catch((error) => {
        console.error("Erro ao mover:", error);
      });
  }

  handleRemoveRole(event) {
    const relId = event.target.dataset.id;

    updateContactRole({ relationshipId: relId, newRole: null })
      .then(() => {
        return refreshApex(this.wiredContactsResult);
      })
      .catch((error) => {
        console.error("Erro ao remover papel:", error);
      });
  }

  handleDelete(event) {
    const relId = event.target.dataset.id;

    deleteContractRelationship({ relationshipId: relId })
      .then(() => {
        return refreshApex(this.wiredContactsResult);
      })
      .catch((error) => {
        console.error("Erro ao deletar:", error);
      });
  }
}
