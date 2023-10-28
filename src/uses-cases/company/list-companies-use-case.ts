import { CompanyRepository } from "@/repositories/company-repository";

interface CreateCompanyCaseRequest {
  id: string;
  pageNumber: number;
  pageSize: number;
}

export class ListCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute({ id, pageNumber, pageSize = 10 }: CreateCompanyCaseRequest) {
    const company = await this.companyRepository.listCompaniesByUser(
      id,
      pageNumber,
      pageSize
    );
    return company;
  }
}
