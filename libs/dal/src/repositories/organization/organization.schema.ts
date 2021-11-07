import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { OrganizationEntity } from './organization.entity';

const organizationSchema = new Schema(
  {
    name: Schema.Types.String,
    logo: Schema.Types.String,
  },
  schemaOptions
);

interface IOrganizationDocument extends OrganizationEntity, Document {
  _id: never;
}

export const Organization =
  mongoose.models.Organization || mongoose.model<IOrganizationDocument>('Organization', organizationSchema);
