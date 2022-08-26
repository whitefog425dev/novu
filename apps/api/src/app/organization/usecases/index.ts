import { CreateOrganization } from './create-organization/create-organization.usecase';
import { GetOrganization } from './get-organization/get-organization.usecase';
import { AddMember } from './membership/add-member/add-member.usecase';
import { RemoveMember } from './membership/remove-member/remove-member.usecase';
import { GetMembers } from './membership/get-members/get-members.usecase';
import { ChangeMemberRole } from './membership/change-member-role/change-member-role.usecase';
import { UpdateBrandingDetails } from './update-branding-details/update-branding-details.usecase';
import { GetOrganizations } from './get-organizations/get-organizations.usecase';

export const USE_CASES = [
  AddMember,
  CreateOrganization,
  GetOrganization,
  GetMembers,
  RemoveMember,
  ChangeMemberRole,
  UpdateBrandingDetails,
  GetOrganizations,
];
