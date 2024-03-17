import { ProductDto } from "./product.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateProductDto extends PartialType(ProductDto) {}