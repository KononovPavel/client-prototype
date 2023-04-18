export function extractCustomerId(): string {
  const id = localStorage.getItem("customerId")
  if (id) {
    return id;
  }
  return '';
}

export function extractCustomerRole(): string {
  const role = localStorage.getItem("customerRole")
  if(role) {
    return role
  }
  return 'Customer'
}
