export declare class InvoiceItemDto {
    product: string;
    inventory?: string;
    quantity: number;
    unitPrice: number;
    gstRate?: number;
    totalPrice: number;
}
export declare class CreateInvoiceDto {
    invoiceNumber?: string;
    customer: string;
    items: InvoiceItemDto[];
    subTotal: number;
    totalTax: number;
    grandTotal: number;
    paidAmount?: number;
    outstandingAmount?: number;
    status?: string;
    issueDate?: string;
    dueDate?: string;
    company?: string;
    placeOfSupply?: string;
    reverseCharge?: boolean;
    notes?: string;
    bankDetails?: string;
    termsAndConditions?: string;
}
