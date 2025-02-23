import pandas as pd
import re

def clean_csv_data(input_csv: str, output_csv: str):
    # Read the CSV dataset
    df = pd.read_csv(input_csv)

    # Clean the Ingredients column by removing all single quotes
    df['Ingredients'] = df['Ingredients'].apply(lambda x: x.replace("'", "") if isinstance(x, str) else x)

    # Function to clean and number the instructions
    def clean_instructions(instr: str) -> str:
        if not isinstance(instr, str):
            return instr

        # Split instructions by newlines, semicolons, or periods followed by whitespace
        steps = re.split(r'\n|;|\.\s*', instr)
        # Remove any empty strings
        steps = [step.strip() for step in steps if step.strip()]
        
        # Prefix each step with a number if not already numbered
        numbered_steps = []
        for i, step in enumerate(steps, start=1):
            # If the step already starts with a number followed by a punctuation, leave it as is.
            if re.match(r'^\d+[\.\)]\s*', step):
                numbered_steps.append(step)
            else:
                numbered_steps.append(f"{i}. {step}")
        return "\n".join(numbered_steps)

    # Clean the Instructions column
    df['Instructions'] = df['Instructions'].apply(clean_instructions)

    # Save the cleaned dataset to a new CSV file
    df.to_csv(output_csv, index=False)
    print(f"Cleaned data saved to {output_csv}")

# Example usage:
if __name__ == '__main__':
    input_csv = 'recipes_with_descriptions.csv'
    output_csv = 'recipes_cleaned.csv'
    clean_csv_data(input_csv, output_csv)
