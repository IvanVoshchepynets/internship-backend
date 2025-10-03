export const formHtml = `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <title>AdServer Line Item Form</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded shadow-md w-full max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Створити Line Item</h1>
    <form action="/adServer/form" method="POST" enctype="multipart/form-data" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Розмір (наприклад 300x250)</label>
        <input type="text" name="size" required class="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Мінімальний CPM ($)</label>
        <input type="number" step="0.01" name="minCpm" required class="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Максимальний CPM ($)</label>
        <input type="number" step="0.01" name="maxCpm" required class="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Geo (наприклад UA, US)</label>
        <input type="text" name="geo" required class="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Тип реклами</label>
        <select name="adType" class="mt-1 block w-full border rounded p-2">
          <option value="banner">Банер</option>
          <option value="video">Відео</option>
          <option value="native">Нативна</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium">Частота показів</label>
        <input type="number" name="frequency" required class="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Креатив (зображення)</label>
        <input type="file" name="creative" accept="image/*" required class="mt-1 block w-full" />
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Зберегти</button>
    </form>
  </div>
</body>
</html>
`;
