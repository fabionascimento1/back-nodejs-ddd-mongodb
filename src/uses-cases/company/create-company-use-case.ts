import { CompanyRepository } from "@/repositories/company-repository";

interface CreateCompanyCaseRequest {
  user: string;
  name: string;
  street: string;
  region: string;
  number: string;
  complement?: string;
  city: string;
  coutry: string;
  postalcode: string;
  floor: [];
  active: boolean;
}

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute({
    user,
    name,
    street,
    region,
    number,
    complement,
    city,
    coutry,
    postalcode,
    floor,
    active,
  }: CreateCompanyCaseRequest) {
    const company = await this.companyRepository.create({
      user,
      name,
      street,
      region,
      number,
      complement,
      city,
      coutry,
      postalcode,
      floor,
      active,
    });
    return {
      company,
    };
  }
}
