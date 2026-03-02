import os
import sys

# Set your root directory here (use absolute path to avoid duplication)
root_dir = r'C:\Users\wwwhj\Downloads\matanuska-main'

# Ensure we're using absolute path and normalize it
root_dir = os.path.abspath(root_dir)

def generate_tree(directory, prefix='', max_depth=3, current_depth=0, exclude_dirs=['node_modules', '__pycache__', '.git']):
    """
    Recursively generates a tree structure string for the directory.
    Uses ASCII characters only to avoid encoding issues.
    """
    if current_depth > max_depth:
        return ''
    try:
        items = sorted([item for item in os.listdir(directory) if not item.startswith('.') and item not in exclude_dirs])
    except (PermissionError, FileNotFoundError):
        return ''
    tree = ''
    for i, item in enumerate(items):
        path = os.path.join(directory, item)
        # Use ASCII characters only (no Unicode box-drawing chars)
        connector = '`-- ' if i == len(items) - 1 else '|-- '
        tree += f"{prefix}{connector}{item}\n"
        if os.path.isdir(path):
            new_prefix = prefix + ('    ' if i == len(items) - 1 else '|   ')
            tree += generate_tree(path, new_prefix, max_depth, current_depth + 1, exclude_dirs)
    return tree

# Generate overall tree (limited to depth 2 for brevity)
overall_tree_md = f"## Overall Monorepo Structure\n```\n{os.path.basename(root_dir)}/\n"
overall_tree_md += generate_tree(root_dir, max_depth=2)
overall_tree_md += "```\n"

# Detailed tree for Dashboard src/ (deeper depth)
dashboard_src = os.path.join(root_dir, 'src')
dashboard_tree_md = ''
if os.path.exists(dashboard_src):
    dashboard_tree_md = f"## Dashboard App (src/)\n```\nsrc/\n"
    dashboard_tree_md += generate_tree(dashboard_src, max_depth=4)
    dashboard_tree_md += "```\n"

# Detailed tree for Workshop Mobile (mobile/src/)
workshop_src = os.path.join(root_dir, 'mobile', 'src')
workshop_tree_md = ''
if os.path.exists(workshop_src):
    workshop_tree_md = f"## Workshop Mobile App (mobile/src/)\n```\nmobile/src/\n"
    workshop_tree_md += generate_tree(workshop_src, max_depth=4)
    workshop_tree_md += "```\n"

# Detailed tree for Driver App (mobile-app-nextjs/src/)
driver_src = os.path.join(root_dir, 'mobile-app-nextjs', 'src')
driver_tree_md = ''
if os.path.exists(driver_src):
    driver_tree_md = f"## Driver App (mobile-app-nextjs/src/)\n```\nmobile-app-nextjs/src/\n"
    driver_tree_md += generate_tree(driver_src, max_depth=4)
    driver_tree_md += "```\n"

# Combine everything into Markdown
md_content = f"# Car Craft Co Fleet Management Monorepo Structure\n\n"
md_content += overall_tree_md + "\n" + dashboard_tree_md + "\n" + workshop_tree_md + "\n" + driver_tree_md

# Write to file directly (avoid console encoding issues)
output_file = os.path.join(root_dir, 'monorepo_structure.md')
try:
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"Markdown file saved to: {output_file}")
except Exception as e:
    print(f"Error saving file: {str(e)}")
    sys.exit(1)