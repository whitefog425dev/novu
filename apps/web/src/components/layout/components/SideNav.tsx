import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { useQuery } from 'react-query';
import { IOrganizationEntity } from '@notifire/shared';
import { NavLink } from 'react-router-dom';
import { SettingOutlined, NotificationOutlined, MonitorOutlined, TeamOutlined } from '@ant-design/icons';

const { Sider } = Layout;

type Props = {};

export function SideNav({}: Props) {
  const { data: organization, isLoading: isOrganizationLoading } = useQuery<IOrganizationEntity>(
    '/v1/organizations/me'
  );

  return (
    <Sider className="side-nav" width={250} collapsed={false} theme="light">
      <Scrollbars autoHide>
        <Menu mode="inline">
          <Menu.Item icon={<NotificationOutlined />}>
            <NavLink to="/templates" className="nav-text" data-test-id="side-nav-templates-link">
              <span>Notifications</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item icon={<MonitorOutlined />}>
            <NavLink to="/activities" className="nav-text" data-test-id="side-nav-activities-link">
              <span>Activity Feed</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item icon={<SettingOutlined />}>
            <NavLink to="/settings/widget" className="nav-text" data-test-id="side-nav-settings-link">
              <span>Settings</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item icon={<TeamOutlined />}>
            <NavLink to="/settings/organization" className="nav-text" data-test-id="side-nav-settings-organization">
              <span>Team Members</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Scrollbars>
    </Sider>
  );
}
