export declare class CreatePaymentDto {
    invoice: string;
    customer: string;
    amount: number;
    paymentDate?: string;
    paymentMethod: string;
    status?: string;
    referenceNumber?: string;
    notes?: string;
    company?: string;
}
