const API_URL = "https://faq-crud.onrender.com/api/faqs";
const addBtn = document.getElementById("add-btn");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const faqList = document.getElementById("faq-list");
const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");

let editingId = null;

async function loadFAQs() {
  faqList.innerHTML = `<p class="loading"> <i class="fa-solid fa-spinner"></i>Loading</p>`;
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    const data = result.data;

    faqList.innerHTML = "";
    data.forEach((item) => {
      const faq = document.createElement("div");
      faq.classList.add("faq");
      faq.innerHTML = `
                <div class="question">
                    <h3>${item.question}</h3>
                    <i class="fa-solid fa-arrow-down"></i>
                </div>
                <div class="answer">
                    <p>${item.answer}</p>
                    <div class="btn-wrap">
                        <button class="edit-btn" data-id="${item.id}">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="delete-btn" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
      faqList.append(faq);
    });
  } catch (err) {
    console.error(err);
    faqList.innerHTML = "<p>Error</p>";
  }
}

async function createFAQ(question, answer) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        answer: answer,
      }),
    });

    const result = await res.json();

    if (result.success) {
      return result.data;
    } else {
      console.error(result);
      alert("Add failed: " + JSON.stringify(result));
    }
  } catch (err) {
    console.error(err);
    alert("Add failed: " + err.message);
  }
}

async function updateFAQ(id, question, answer) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question,
        answer: answer,
      }),
    });

    const result = await res.json();

    if (result.success) {
      return result.data;
    } else {
      console.error(result);
      alert("Update failed: " + JSON.stringify(result));
    }
  } catch (err) {
    console.error(err);
    alert("Update failed: " + err.message);
  }
}

async function deleteFAQ(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
}
faqList.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");
  const questionDiv = e.target.closest(".question");

  if (questionDiv) {
    questionDiv.parentElement.classList.toggle("active");
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    await deleteFAQ(id);
    loadFAQs();
  }

  if (editBtn) {
    const id = editBtn.dataset.id;
    const res = await fetch(`${API_URL}/${id}`);
    const result = await res.json();
    const item = result.data;

    questionInput.value = item.question;
    answerInput.value = item.answer;
    modal.style.display = "flex";
    editingId = id;
  }
});

addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  questionInput.value = "";
  answerInput.value = "";
  editingId = null;
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

saveBtn.addEventListener("click", async () => {
  const questionText = questionInput.value.trim();
  const answerText = answerInput.value.trim();
  if (!questionText || !answerText) return;

  if (editingId) {
    await updateFAQ(editingId, questionText, answerText);
  } else {
    await createFAQ(questionText, answerText);
  }

  modal.style.display = "none";
  loadFAQs();
});

loadFAQs();
