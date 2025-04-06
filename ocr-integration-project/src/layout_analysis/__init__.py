import numpy as np
from sklearn.cluster import KMeans

def layout_analysis(line_data, n_clusters=3):
    """
    Groups extracted text into logical sections (e.g., Nutritional Values, Ingredients)
    using K-means clustering based on spatial positioning, with text sorted within clusters
    by reading order (top-to-bottom, left-to-right). Optionally groups text into rows within
    clusters for complex table structures.

    Parameters:
    - line_data (list): A list of dictionaries containing text elements and their bounding boxes
                        from OCR extraction. Each dict has 'text' and 'box' (left, top, width, height).
    - n_clusters (int): Number of clusters to form (default=3). Adjust this based on the product
                        label’s complexity (e.g., number of distinct sections like nutritional
                        values, ingredients, etc.).

    Returns:
    - dict: A dictionary with cluster numbers as keys and lists of text strings as values,
            sorted by top then left coordinates within each cluster, with row-wise ordering.
    """
    if not line_data:
        return {}

    # Extract coordinates for clustering using center points
    coordinates = []
    for line in line_data:
        left, top, width, height = line['box']
        center_x = left + width / 2
        center_y = top + height / 2
        coordinates.append([center_x, center_y])
    
    X = np.array(coordinates)

    # Adjust number of clusters if there are fewer data points
    if len(X) < n_clusters:
        n_clusters = max(1, len(X))

    # Apply K-means clustering
    try:
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(X)
    except Exception as e:
        print(f"Clustering error: {e}")
        return {}

    # Group full line_data dictionaries by clusters
    cluster_data = {}
    for idx, cluster_id in enumerate(clusters):
        if cluster_id not in cluster_data:
            cluster_data[cluster_id] = []
        cluster_data[cluster_id].append(line_data[idx])

    # Process each cluster: sort and group into rows
    cluster_texts = {}
    for cluster_id in cluster_data:
        # Sort initially by top then left coordinates
        sorted_items = sorted(cluster_data[cluster_id], key=lambda x: (x['box'][1], x['box'][0]))
        
        # Calculate average height as threshold for row grouping
        threshold = np.mean([item['box'][3] for item in sorted_items])  # average height
        
        # Group into rows based on top coordinate differences
        rows = []
        current_row = []
        prev_top = None
        
        for item in sorted_items:
            top = item['box'][1]
            if prev_top is None or abs(top - prev_top) < threshold:
                current_row.append(item)
            else:
                # Sort the completed row by left coordinate
                current_row.sort(key=lambda x: x['box'][0])
                rows.append(current_row)
                current_row = [item]
            prev_top = top
        
        # Add the last row
        if current_row:
            current_row.sort(key=lambda x: x['box'][0])
            rows.append(current_row)
        
        # Flatten rows into a single list of text strings
        cluster_texts[cluster_id] = [item['text'] for row in rows for item in row]

    # Sort clusters by average y-coordinate for top-to-bottom section order
    cluster_positions = {}
    for cluster_id in cluster_texts:
        cluster_coords = [coordinates[i] for i, c in enumerate(clusters) if c == cluster_id]
        avg_y = np.mean([coord[1] for coord in cluster_coords])
        cluster_positions[cluster_id] = avg_y

    sorted_clusters = dict(sorted(cluster_texts.items(), 
                                  key=lambda x: cluster_positions[x[0]]))
    
    return sorted_clusters