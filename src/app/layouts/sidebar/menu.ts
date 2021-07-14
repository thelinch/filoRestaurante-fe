import { MenuItem } from "./menu.model";
export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "Dashboard",
    isTitle: false,
    link: "/dashboards",
    permissions: [],
    visible: false,
  },
  {
    id: 8,
    label: "Ventas",
    isTitle: false,
    link: "/process/sales",
    permissions: [],
    visible: false,
  },
  {
    id: 9,
    label: "Pedidos",
    link: "/process/orders",
    isTitle: false,
    permissions: [],
    visible: false,
  },
  {
    id: 60,
    label: "Configuracion",
    icon: "bx-calendar",
    link: "/calendar",
    permissions: [],
    visible: false,

    subItems: [
      {
        id: 13,
        label: "Categoria",
        link: "/master/categories",
        parentId: 60,
        permissions: [],
        visible: false,
      },
      {
        id: 13,
        label: "Productos",
        link: "/master/products",
        parentId: 60,
        permissions: [],
        visible: false,
      },
      {
        id: 154,
        label: "Mesas",
        link: "/master/tables",
        parentId: 60,
        permissions: [],
        visible: false,
      },
    ],
  },
  {
    id: 12,
    label: "Seguridad",
    icon: "bx-store",
    permissions: [],

    visible: false,
    subItems: [
      {
        id: 13,
        label: "Roles",
        link: "/seguridad/roles",
        parentId: 12,
        visible: false,

        permissions: [],
      },
      {
        id: 14,
        label: "Acciones",
        link: "/seguridad/acciones",
        parentId: 12,
        permissions: [],
        visible: false,
      },
      {
        id: 15,
        label: "Usuarios",
        link: "/seguridad/usuarios",
        parentId: 12,
        permissions: [],
        visible: false,
      },
    ],
  },
];
