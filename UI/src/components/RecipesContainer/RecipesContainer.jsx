import { useState, useEffect } from "react";
import "./RecipesContainer.scss";

function RecipesContainer({
  children,
  itemsPerPage = 10,
  totalItems = 0,
  currentOffset = 0,
  setOffset,
}) {
  const [currentPage, setCurrentPage] = useState(
    Math.floor(currentOffset / itemsPerPage) + 1
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setCurrentPage(Math.floor(currentOffset / itemsPerPage) + 1);
  }, [currentOffset, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOffset((page - 1) * itemsPerPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div>
      <div className="recipes-container recipes__recipes-container">
        {children}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={i} className="dots">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => goToPage(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipesContainer;
