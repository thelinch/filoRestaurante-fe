import { MenuItem } from "./menu.model";
export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "Dashboard",
    isTitle: false,
    link: "/dashboards",
    icon: "bx bx-line-chart",
    permissions: ["dashboard-ver-dashboard"],
    visible: false,
  },
  {
    id: 8,
    label: "Ventas",
    isTitle: false,
    icon: "fas fa-cash-register",
    link: "/process/sales",
    permissions: ["ventas-ver-ventas"],
    visible: false,
  },
  {
    id: 9,
    label: "Pedidos",
    icon: "fas fa-rocket",
    link: "/process/orders",
    isTitle: false,
    permissions: ["pedidos-ver-perdidos"],
    visible: false,
  },
  {
    id: 60,
    label: "Configuracion",
    icon: "fas fa-cog",
    permissions: ["configuracion-ver-configuracion"],
    visible: false,

    subItems: [
      {
        id: 13,
        label: "Categoria",
        link: "/master/categories",
        parentId: 60,
        permissions: ["configuracion-ver-categorias"],
        visible: false,
      },
      {
        id: 13,
        label: "Productos",
        link: "/master/products",
        parentId: 60,
        permissions: ["configuracion-ver-productos"],
        visible: false,
      },
      {
        id: 154,
        label: "Mesas",
        link: "/master/tables",
        parentId: 60,
        permissions: ["configuracion-ver-mesas"],
        visible: false,
      },
    ],
  },
  {
    id: 12,
    label: "Seguridad",
    icon: "bx bx-shield-quarter",
    permissions: ["seguridad-ver-seguridad"],

    visible: false,
    subItems: [
      {
        id: 13,
        label: "Roles",
        link: "/seguridad/roles",
        parentId: 12,
        visible: false,

        permissions: ["seguridad-ver-roles"],
      },
      {
        id: 14,
        label: "Acciones",
        link: "/seguridad/acciones",
        parentId: 12,
        permissions: ["seguridad-ver-acciones"],
        visible: false,
      },
      {
        id: 15,
        label: "Usuarios",
        link: "/seguridad/usuarios",
        parentId: 12,
        permissions: ["seguridad-ver-usuarios"],
        visible: false,
      },
    ],
  },
];
