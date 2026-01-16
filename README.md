# Flow2 Low-Code Platform

A modern, extensible low-code platform built with Vue 3, TypeScript, and Vite. This project features a powerful Workflow Designer and a dynamic Form Builder, designed for rapid application development.

## ✨ Features

### 1. Workflow Designer (Logic Orchestration)
*   **Visual Editor**: Drag-and-drop node-based interface powered by `@vue-flow`.
*   **Node Types**: Supports various node types including Start, End, Process, Approval, Branch, etc.
*   **Custom Styling**: Beautiful, card-style nodes with custom handles and dynamic content.
*   **Connection Logic**: Intelligent connection validation with smooth, curved edges and animated flows.
*   **History Management**: Robust Undo/Redo functionality for all canvas operations.
*   **Configuration**: Side panel for detailed node configuration using JSON Schema.

### 2. Form Builder (UI Construction)
*   **Drag-and-Drop Canvas**: Intuitive builder interface using `vuedraggable`.
*   **Component Library**: Rich set of form components (Input, Number, Select, Checkbox, Radio, Date, Upload, Group).
*   **Live Preview**: "What You See Is What You Get" (WYSIWYG) editing experience.
*   **Schema-Driven**: Forms are backed by a JSON structure, making them easy to save, load, and generate code from.
*   **Configuration**: Real-time property configuration (Labels, Placeholders, Validation rules).
*   **Interactive Sorting**: Nested sorting capabilities for complex form layouts.

## 🛠 Tech Stack

*   **Core**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`), [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Routing**: [Vue Router](https://router.vuejs.org/)
*   **UI Framework**: [Element Plus](https://element-plus.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Workflow Engine**: [@vue-flow](https://vueflow.dev/)
*   **Drag & Drop**: [vuedraggable](https://github.com/SortableJS/vue.draggable.next) (SortableJS)
*   **Icons**: [Lucide Vue](https://lucide.dev/), Element Plus Icons
*   **Backend**: [NestJS](https://nestjs.com/) (REST API, Swagger)

## 📂 Project Structure

```bash
root/
├── src/                # Frontend source code
│   ├── components/     # Shared components
│   ├── pages/          # Workflow module pages
│   ├── views/          # Form Builder module
│   ├── stores/         # Pinia state stores
│   └── ...
├── backend/            # Backend source code (NestJS)
│   ├── src/
│   │   ├── workflows/  # Workflows module
│   │   ├── forms/      # Forms module
│   │   └── ...
│   └── ...
└── ...
```

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   pnpm (recommended) or npm/yarn

### Frontend Installation

1.  **Install dependencies**
    ```bash
    pnpm install
    ```

2.  **Start development server**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:5173`.

### Backend Installation

1.  **Navigate to backend directory**
    ```bash
    cd backend
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Start backend server**
    ```bash
    pnpm start:dev
    ```
    The API will be available at `http://localhost:3000`.
    API Documentation (Swagger) is available at `http://localhost:3000/api`.

### Build for Production

**Frontend:**
```bash
pnpm build
```

**Backend:**
```bash
cd backend
pnpm build
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

[MIT](LICENSE)
