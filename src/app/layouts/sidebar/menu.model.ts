export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  visible: boolean;
  link?: string;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  permissions?: Array<string>;
}
