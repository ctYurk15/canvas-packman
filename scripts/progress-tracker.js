class ProgressTracker
{
    constructor(high_scores_text, high_scores_cell_name)
    {
        this.high_scores_text = high_scores_text;
        this.high_scores_cell_name = high_scores_cell_name;


        if(localStorage.getItem(this.high_scores_cell_name) == null)
        {
            localStorage.setItem(this.high_scores_cell_name, 0);
        }
    }

    updateHighscores(new_scores)
    {
        const previous_scores = localStorage.getItem(this.high_scores_cell_name);
        if(new_scores > previous_scores) localStorage.setItem(this.high_scores_cell_name, new_scores);

        this.updateUI();
    }

    updateUI()
    {
        const high_scores = localStorage.getItem(this.high_scores_cell_name);
        this.high_scores_text.innerHTML = parseInt(high_scores);
    }
}